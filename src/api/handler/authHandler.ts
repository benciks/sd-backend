import { router } from '../api'
import { HttpBadRequestError, wrap } from '../wrapper'
import Express from 'express'
import { User } from '../../db/entity/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { routeGuard } from '../middleware/routeGuard'
import { UserInvite } from '../../db/entity/userInvite'
import MailService from '../../service/mailService'

export const JWTSecret = 'mimhJctdqC8Em4mWBVSBjbjnNSzWLc22'

export default class AuthHandler {
    async initialize() {
        router.post('/login', wrap(this.login))
        router.get('/users/me', routeGuard(), wrap(this.getUserMe))
        router.post('/inviteUser', routeGuard(), wrap(this.inviteUser))
        router.post('/registration', wrap(this.registerUser))
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

    async registerUser(req: Express.Request) {
        const body = req.body
        const invite = await UserInvite.findOne({ where: { email: body.email } })

        if (!invite) {
            throw new HttpBadRequestError('This email address is not on whitelist.')
        }

        if (invite.validUntil.getTime() < new Date().getTime()) {
            await invite.remove()
            throw new HttpBadRequestError('Token has already expired.')
        }

        await User.new(body.name, body.email, body.password)
    }

    async inviteUser(req: Express.Request) {
        const body = req.body
        const user = await User.findOne({ where: { email: body.email } })

        if (user) {
            throw new HttpBadRequestError('User already exists')
        }

        await UserInvite.New(body.email)

        const invite = await UserInvite.findOne({ where: { email: body.email } })
        await MailService.sendInvite(invite)
    }
}
