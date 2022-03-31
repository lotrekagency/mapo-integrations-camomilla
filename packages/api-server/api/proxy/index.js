const app = require('express')()
const cookieParser = require("cookie-parser");
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware')


module.exports = (options) => {
    const { 
        target,
        headers,
        changeOrigin,
        pathRewrite,
        onProxyRes,
        onProxyReq,
    } = options.api || {}

    const proxyOptions = {
        target,
        headers,
        changeOrigin: changeOrigin !== undefined ? changeOrigin : true,
        onProxyReq: (proxyReq, req, res) => {
            const { csrftoken } = req.cookies
            if (csrftoken) proxyReq.setHeader('X-CSRFToken', csrftoken)
            if (typeof onProxyReq === 'function') {
                onProxyReq(proxyReq, req, res)
            }
        },
        pathRewrite: {
            '^/api/auth/login': '/api/camomilla/auth/login/',
            '^/api/auth/logout': '/api/camomilla/auth/logout/',
            '^/api/profiles/me': '/api/camomilla/users/current/',
            '^/api/media': '/api/camomilla/media',
            '^/api/media-folder': '/api/camomilla/media-folder',
            ...pathRewrite
        }
    }

    if (typeof onProxyRes === 'function') {
        proxyOptions.onProxyRes = responseInterceptor(onProxyRes)
    }

    app.use(cookieParser())
    app.use(createProxyMiddleware(proxyOptions));

    return app
}