import { router } from '../api'
import { wrap } from '../wrapper'

export default class HomeHandler {
    async initialize() {
        router.get('/', wrap(this.getHome))
    }

    async getHome() {
        return 'Hello!'
    }
}
