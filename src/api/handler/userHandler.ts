import { router } from '../api'
import { wrap } from '../wrapper'
import { routeGuard } from '../middleware/routeGuard'
import { User } from '../../db/entity/user'
import Express from 'express'

export default class UserHandler {
    async initialize() {
        router.get('/users', routeGuard(), wrap(this.getAllUsers))
        router.get('/users/me', routeGuard(), wrap(this.getUserMe))
        router.post('/users/me', routeGuard(), wrap(this.updateUser))
    }

    async getAllUsers() {
        return User.find()
    }

    async getUserMe(req: Express.Request) {
        return await req.getUser()
    }

    async updateUser(req: Express.Request) {
        const body = req.body
        const currentUser = await req.getUser()

        const user = await User.findOne({ where: { id: currentUser.id } })

        Object.assign(user, {
            name: body.name,
            email: body.email,
            password: body.password,
        })

        await user.save()
    }
}
