# mapo-integrations-[camomilla](https://github.com/lotrekagency/camomilla) 🌼 
[![npm (scoped)](https://img.shields.io/npm/v/@mapomodule/mapo-integrations-camomilla?style=flat-square)](https://www.npmjs.com/package/@mapomodule/mapo-integrations-camomilla) [![GitHub](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE.md)


This package implements an integration between the camomilla cms api interfaces and the nuxt module [`mapo`](https://github.com/lotrekagency/mapo).

## Install:

Add @mapomodule/mapo-integrations-camomilla dependency to your project:
```sh
yarn add @mapomodule/mapo-integrations-camomilla # or npm install @mapomodule/mapo-integrations-camomilla
```
## Setup:
 - In order to use this integration you need **`django-camomilla-cms >= 5.7.1`**.
 - You also need to add **`"camomilla.authentication.SessionAuthentication"`** to rest framework authentication classes.
 ```py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        ...
        "camomilla.authentication.SessionAuthentication",
        ...
    ),
    ...
}
 ```
 

 - After installing mapo in your nuxt project provide the integration configuration in `nuxt.config.js`.

```js
{
  buildModules: [
    'mapomodule'
  ],
  mapo: {
    integrations: {
      camomilla: {
        location: "@mapomodule/integrations-camomilla",
        configuration: {
          api: {
            target: 'http://localhost:8000',
          }
        }
      }
    }
  }
}
```

## Options:
For now all the available options reside under the key "api".

 - **target**: `string` Here you can pass the root of the camomilla api endpoint. (required)
 - **headers**: `object` Here you can pass additional static headers. The headers will be injected in all requests.
 - **changeOrigin**: `boolean` Here you can decide whether to change the origin of requests sent to camomilla. (default: true)
 - **pathRewrite**: `object` Here you can pass some rewrite patterns. es. (pathRewrite: {'^/old/api' : '/new/api'})
 - **onProxyRes**: `function` Here you can manipulate the request before it is sent to camomilla.
 - **onProxyReq**: `function` Here you can manipulate the response before it is sent back to mapo.
 - **use**: `function | function[]` Here you can pass one or more express middlewares, they will be implemented on top of the request.
 - **base**: `string` Here you can pass a base url that will be used as base path for all the integrations urls (default: takes the value of your nuxt router base prop).
 - **syncCamomillaSession**: `boolean` Here you can decide if you want to syncronize the session between mapo and camomilla. (default: false)

 For options like **target**, **headers**, **changeOrigin**, **pathRewrite**, **onProxyRes** and **onProxyReq** you can find more information on [**http-proxy-middleware**](https://github.com/chimurai/http-proxy-middleware) page.