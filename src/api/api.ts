import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'

import path from 'path'
import { registerCors } from './middleware/cors'

import { checkAuthHeader } from './middleware/auth'
import { Server } from 'http'
import * as OpenApiValidator from 'express-openapi-validator'

export const app = express()
export let appServer: Server

registerCors()
app.use(bodyParser.json())
export const router = express.Router()

export default async function (port = 3000) {
    //import all handlers
    const handlers = fs.readdirSync(path.resolve(__filename, '../handler/'))
    for (const key in handlers) {
        const handlerName = handlers[key]
        //make sure file ends with .js
        if (!/^.*\.(js|ts)$/.test(handlerName)) {
            continue
        }

        const filePath = path.resolve(__filename, '../handler/', handlerName)
        const handlerFile = require(filePath)

        try {
            //try to initialize the handler
            const handler = new handlerFile.default()
            await handler.initialize()
            console.log(`Initialized ${handler.__proto__.constructor.name}`)
        } catch (e) {
            console.error(e)
        }
    }

    app.use(checkAuthHeader)

    app.use(
        OpenApiValidator.middleware({
            apiSpec: './reference/Template.v1.yaml',
            validateRequests: true,
            validateResponses: false,
        }),
    )

    app.use('/', router)
    app.use((req: express.Request, res: express.Response) => {
        res.status(404).send({
            error: 'Not found',
        })
    })

    appServer = app.listen(port, () => {
        console.log(`🚀 Server started at http://localhost:${port}`)
    })
}
