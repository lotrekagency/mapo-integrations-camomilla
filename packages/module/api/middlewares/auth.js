const libCookie = require('cookie');
const setCookie = require('set-cookie-parser');

const validCookies = ["__mapo_session", "sessionid", "csrftoken"]

const mapAuthLogicFactory = ({ sync }) => (proxyRes, req, res) => {
    const paths = [
        "/api/camomilla/auth/login/",
        "/api/camomilla/auth/logout/"
    ]
    if (paths.includes(req.path)) {
        const cookies = setCookie.parse(proxyRes);
        const sessionid = cookies.find(c => c.name == "sessionid")
        const __mapo_session = cookies.find(c => c.name == "__mapo_session")
        if (sessionid && !__mapo_session) cookies.push({ ...sessionid, name: "__mapo_session" });
        proxyRes.headers["set-cookie"] = cookies
            .filter(cookie => sync || cookie.name !== "sessionid")
            .map(cookie => libCookie.serialize(cookie.name, cookie.value, cookie));
    }
}

const mapCookiesFactory = ({ sync }) => (req, res, next) => {
    const { csrftoken, __mapo_session } = req.cookies
    if (__mapo_session) req.cookies.sessionid = __mapo_session
    if (csrftoken && req.path !== "/auth/login") req.headers['X-CSRFToken'] = csrftoken
    if (!sync || req.path == "/auth/logout") req.headers['cookie'] = Object.keys(req.cookies).map(k => `${k}=${req.cookies[k]}`).join(";")
    if (req.path == "/auth/login"){
        delete req.cookies.sessionid
        delete req.cookies.__mapo_session
        delete req.cookies.csrftoken
        req.headers['cookie'] = Object.keys(req.cookies).map(k => `${k}=${req.cookies[k]}`).join(";")
    }
    next()
}

var referer

const mapForwardedProps = (req, res, next) => {
    try {
        referer = req.headers.referer ? new URL(req.headers.referer) : referer
        req.headers['x-Forwarded-Host'] = referer.host || ""
        req.headers['x-Forwarded-Proto'] = (referer.protocol || "").replace(/:+$/, '')
    } catch (_) { }
    next()
}

const cleanUnnededCookies = (req, res, next) => {
    try {
        req.headers['cookie'] = req.headers['cookie'].split(";").filter(c => validCookies.some(v => c.split("=")[0].includes(v))).join(";");
    } catch (_) { }
    next()
}

const mapAuthLogic = mapAuthLogicFactory({ sync: false })
const mapAuthLogicSync = mapAuthLogicFactory({ sync: true })
const mapCookies = mapCookiesFactory({ sync: false })
const mapCookiesSync = mapCookiesFactory({ sync: true })

module.exports = {
    mapAuthLogic,
    mapAuthLogicSync,
    mapCookies,
    mapCookiesSync,
    mapForwardedProps,
    cleanUnnededCookies
}
