const app = require('express')()
const cookieParser = require("cookie-parser");
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const { mapAuthLogic, mapAuthLogicSync, mapCookies, mapCookiesSync } = require('../middlewares/auth.js');


module.exports = (options) => {
    const {
        target,
        headers,
        changeOrigin,
        pathRewrite,
        onProxyRes,
        onProxyReq,
        use,
        base,
        syncCamomillaSession
    } = options.api || {}

    const baseUrl = base && (['/', 'http://', 'https://'].some(w => base.startsWith(w)) ? base : ("/" + base)).replace(/\/+$/, '') || ""

    const authMiddleware = syncCamomillaSession ? mapAuthLogicSync : mapAuthLogic
    const cookiesMiddleware = syncCamomillaSession ? mapCookiesSync : mapCookies

    const proxyOptions = {
        target,
        headers,
        changeOrigin: changeOrigin !== undefined ? changeOrigin : true,
        onProxyReq,
        onProxyRes: authMiddleware,
        pathRewrite: {
            [`^${baseUrl}/api/auth/login`]: '/api/camomilla/auth/login/',
            [`^${baseUrl}/api/auth/logout`]: '/api/camomilla/auth/logout/',
            [`^${baseUrl}/api/profiles/me`]: '/api/camomilla/users/current/',
            [`^${baseUrl}/api/media`]: '/api/camomilla/media',
            [`^${baseUrl}/api/media-folder`]: '/api/camomilla/media-folder',
            [`^${baseUrl}/api`]: '/api',
            ...pathRewrite
        },
    }

    if (typeof onProxyRes === 'function') {
        proxyOptions.onProxyRes = (proxyRes, req, res) => {
            authMiddleware(proxyRes, req, res)
            responseInterceptor(onProxyRes)(proxyRes, req, res)
        }
    }

    if (typeof use === 'function') {
        app.use(use);
    } else if (Array.isArray(use)) {
        use.filter(func => typeof func == "function").forEach(func => app.use(func));
    }

    app.use(cookieParser());
    app.use(cookiesMiddleware);
    app.use(createProxyMiddleware(proxyOptions));

    return app
}