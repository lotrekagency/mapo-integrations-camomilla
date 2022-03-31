# mapo-integrations-[camomilla](https://github.com/lotrekagency/camomilla) 🌼 
[![npm](https://img.shields.io/npm/v/mapomodule?style=flat-square)](https://www.npmjs.com/package/mapomodule) [![GitHub](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE.md)



## Setup
Add `mapomodule` dependency to your project
```sh
yarn add --dev mapomodule # or npm install --save-dev mapomodule
```
Add mapomodule to the buildModules section of nuxt.config.js
```js
{
  buildModules: [
    // Simple usage
    'mapomodule',

    // With options
    ['mapomodule', { /* module options */ }]
  ]
}
```
 
 Add integration options also from top level nuxt.config.js

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
            domain: 'http://localhost:8000',
          }
        }
      }
    }
  }
}
```
## Features

- Exposes server api integrations.
