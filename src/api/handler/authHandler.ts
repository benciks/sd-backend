import { router } from '../api'
import { HttpBadRequestError, wrap } from '../wrapper'
import Express from 'express'
import { User } from '../../db/entity/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { routeGuard } from '../middleware/routeGuard'
import { UserToken } from '../../db/entity/userToken'
import MailService from '../../service/mailService'

export const JWTSecret = 'mimhJctdqC8Em4mWBVSBjbjnNSzWLc22'

export default class AuthHandler {
    async initialize() {
        router.post('/login', wrap(this.login))
        router.post('/login/forgot', wrap(this.requestPassword))
        router.post('/login/reset', wrap(this.resetPassword))
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

    async registerUser(req: Express.Request) {
        const body = req.body
        const invite = await UserToken.findOne({ where: { email: body.email } })

        if (!invite) {
            throw new HttpBadRequestError('This email address is not on whitelist.')
        }

        if (invite.validUntil.getTime() < new Date().getTime()) {
            await invite.remove()
            throw new HttpBadRequestError('Token has already expired.')
        }

        await User.new(body.name, body.email, body.password)
        await invite.remove()
    }

    async inviteUser(req: Express.Request) {
        const body = req.body
        const user = await User.findOne({ where: { email: body.email } })

        if (user) {
            throw new HttpBadRequestError('User already exists')
        }

        await UserToken.New(body.email)

        const invite = await UserToken.findOne({ where: { email: body.email } })
        await MailService.sendInvite(invite)
    }

    async requestPassword(req: Express.Request) {
        const body = req.body
        const user = await User.findOne({ where: { email: body.email } })

        if (!user) {
            throw new HttpBadRequestError("User doesn't exist")
        }

        await UserToken.New(body.email)

        const invite = await UserToken.findOne({ where: { email: body.email } })
        await MailService.sendPasswordReset(invite)
    }

    async resetPassword(req: Express.Request) {
        const body = req.body
        const user = await User.findOne({ where: { email: body.email } })
        const invite = await UserToken.findOne({ where: { email: body.email } })

        if (!user) {
            throw new HttpBadRequestError('Token or email is invalid.')
        }

        if (invite.email !== user.email) {
            throw new HttpBadRequestError('Token or email is invalid.')
        }

        if (invite.validUntil.getTime() < new Date().getTime()) {
            await invite.remove()
            throw new HttpBadRequestError('Token or email is invalid.')
        }

        const password = bcrypt.hashSync(body.password, 10)

        Object.assign(user, {
            email: body.email,
            password: password,
        })
        await user.save()
        await invite.remove()
    }
}
