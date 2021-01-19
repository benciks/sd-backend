import { router } from '../api'
import { wrap } from '../wrapper'
import { routeGuard } from '../middleware/routeGuard'
import { User } from '../../db/entity/user'
import Express from 'express'

export default class UserHandler {
    async initialize() {
        router.get('/users', routeGuard(), wrap(this.getAllUsers))
        router.get('/users/me', routeGuard(), wrap(this.getUserMe))
    }

    async getAllUsers() {
        return User.find()
    }

    async getUserMe(req: Express.Request) {
        return await req.getUser()
    }
}
