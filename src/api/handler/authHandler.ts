import { router } from '../api'
import { HttpBadRequestError, wrap } from '../wrapper'
import Express from 'express'
import { User } from '../../db/entity/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { routeGuard } from '../middleware/routeGuard'

export const JWTSecret = 'mimhJctdqC8Em4mWBVSBjbjnNSzWLc22'

export default class AuthHandler {
    async initialize() {
        router.post('/auth', wrap(this.login)).get('/users/me', routeGuard(), wrap(this.getUserMe))
    }

    async login(req: Express.Request) {
        const body = req.body as LoginRequest

        const user = await User.findOne({ email: body.email })
        if (!user || !bcrypt.compareSync(body.password, user.password)) {
            throw new HttpBadRequestError('email or password was not found!')
        }

        return {
            jwt: jwt.sign(
                {
                    userId: user.id,
                } as JWTPayload,
                JWTSecret,
            ),
        } as LoginResponse
    }

    async getUserMe(req: Express.Request) {
        return await req.getUser()
    }
}
