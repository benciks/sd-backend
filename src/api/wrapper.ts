import { RequestHandler } from 'express'
import { logger } from '../logger'

//function to wrap api function handler
//provides custom error handling, promise resolving, async context...
type WrapperReturnType = Record<string, unknown> | string | number | Array<any> | unknown
type WrapperFunction = (req?: Express.Request, res?: Express.Response) => WrapperReturnType | Promise<WrapperReturnType>

export const wrap = (fn: WrapperFunction): RequestHandler => {
    return (req, res) => {
        const handleError = (e: Error) => {
            if (isHttpError(e)) {
                return res.status(e.code).send({ error: e.message })
            }
            if (isEntityNotFoundError(e)) {
                return res.status(404).send({ error: e.message })
            }
            logger.error('Internal server error occurred: ', e)
            res.status(500).send({ error: 'Internal Error' })
        }

        Promise.resolve(fn(req, res))
            .catch(handleError)
            .then((returnValue) => {
                if (!returnValue) return res.json()
                Promise.resolve(returnValue)
                    .catch(handleError)
                    .then((val) => {
                        //if server response was returned
                        try {
                            // @ts-ignore
                            if (val.__proto__.app.name === 'app') {
                                return
                            }
                        } catch (e) {}

                        res.json(val)
                    })
            })
    }
}

function isHttpError(obj: any): obj is HttpError {
    return !!(obj as HttpError).code && (obj as Error).name !== 'QueryFailedError'
}

function isEntityNotFoundError(obj: any): obj is HttpNotFoundError {
    return obj.name === 'EntityNotFound'
}

interface HttpError extends Error {
    code: number
}

export class HttpBadRequestError extends Error {
    code = 400
    name = 'BadRequest'
    error?: string
}

export class HttpForbiddenError extends Error {
    code = 403
    name = 'Forbidden'
    error?: string
}

export class HttpNotFoundError extends Error {
    code = 404
    name = 'NotFound'
    error?: string
}
