import { NextFunction, Request, Response } from 'express'

export function routeGuard() {
    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.getUserID() === null) return res.status(401).send({ error: 'Access Denied' })

        next()
    }
}
