import { setupEndpoint } from "@mapomodule/integrations/utils/setup.js"
import path from 'path'

export default async function (options) {

    options.api = { base: (this.options.router || {}).base, ...options.api }
    
    const urlpatterns = [
        { path: '/api', handler: setupEndpoint(path.resolve(__dirname, 'api/proxy/index.js'), options) },
    ]

    for (const middleware of urlpatterns) {
        this.addServerMiddleware(middleware)
    }

}

module.exports.meta = require('./package.json')
