import { router } from '../api'
import { wrap } from '../wrapper'
import { routeGuard } from '../middleware/routeGuard'
import { User } from '../../db/entity/user'
import Express from 'express'
import bcrypt from 'bcrypt'

export default class UserHandler {
    async initialize() {
        router.get('/users', routeGuard(), wrap(this.getAllUsers))
        router.get('/users/me', routeGuard(), wrap(this.getUserMe))
        router.patch('/users/me', routeGuard(), wrap(this.updateUser))
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

        const updateData = req.body

        if (updateData.password) {
            const hashedPassword = bcrypt.hashSync(updateData.password, 10)

            updateData.password = hashedPassword
        }

        Object.assign(user, updateData)

        await user.save()
    }
}
