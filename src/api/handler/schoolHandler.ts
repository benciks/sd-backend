import { router } from '../api'
import Express from 'express'
import { wrap } from '../wrapper'
import { routeGuard } from '../middleware/routeGuard'
import { School } from '../../db/entity/school'

export default class SchoolHandler {
    async initialize() {
        router.get('/schools', wrap(this.getAllSchools))
        router.get('/schools/:id', wrap(this.getSchool))
        router.post('/schools', routeGuard(), wrap(this.addSchool))
        router.patch('/schools/:id', routeGuard(), wrap(this.updateSchool))
        router.delete('/schools/:id', routeGuard(), wrap(this.deleteSchool))
    }

    async getAllSchools() {
        return School.find()
    }

    async getSchool(req: Express.Request) {
        return School.findOne({ where: { id: req.params.id } })
    }

    async addSchool(req: Express.Request) {
        await School.insert(req.body)
    }

    async updateSchool(req: Express.Request) {
        const school = await School.findOne({ where: { id: req.params.id } })

        Object.assign(school, req.body)
        await school.save()
    }

    async deleteSchool(req: Express.Request) {
        await School.delete(req.params.id)
    }
}
