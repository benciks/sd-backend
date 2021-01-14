import { router } from '../api'
import Express from 'express'
import { wrap } from '../wrapper'
import { routeGuard } from '../middleware/routeGuard'
import { School } from '../../db/entity/school'

export default class SchoolHandler {
    async initialize() {
        router.get('/schools', wrap(this.getSchool))
        router.post('/schools', routeGuard(), wrap(this.postSchool))
    }

    async getSchool() {
        return School.find()
    }

    async postSchool(req: Express.Request) {
        const body = req.body
        await School.insert({
            name: body.name,
            url: body.url,
            address: body.address,
            city: body.city,
            postal: body.postal,
            description: body.description,
        })
    }
}
