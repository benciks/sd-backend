import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWTSecret } from '../handler/authHandler'
import { User } from '../../db/entity/user'

export async function checkAuthHeader(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')
    let payload: JWTPayload | null = null

    if (token) {
        if (!jwt.verify(token, JWTSecret)) {
            return res.status(401).send({ error: 'Invalid Authorization JWT!' })
        }

        payload = jwt.decode(token) as JWTPayload
        if (!payload.userId) {
            return res.status(401).send({ error: 'Invalid Authorization JWT Payload!' })
        }
    }

    let user: User
    req.getUser = async () => {
        if (!token) return null
        if (!payload) return null
        if (user) return user

        user = await User.findOne({ id: payload.userId })
        return user
    }

    req.getUserID = () => {
        if (!token) return null
        if (!payload) return null
        if (!payload.userId) return null

        return payload.userId
    }
    next()
}
