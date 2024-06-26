import { router } from '../api'
import Express from 'express'
import { wrap } from '../wrapper'
import { routeGuard } from '../middleware/routeGuard'
import { Article } from '../../db/entity/article'

export default class ArticleHandler {
    async initialize() {
        router.get('/articles', wrap(this.getAllArticle))
        router.get('/articles/:url', wrap(this.getArticle))
        router.post('/articles', routeGuard(), wrap(this.addArticle))
        router.patch('/articles/:url', routeGuard(), wrap(this.updateArticle))
        router.delete('/articles/:id', routeGuard(), wrap(this.deleteArticle))
    }

    async getAllArticle() {
        return Article.find()
    }

    async getArticle(req: Express.Request) {
        return Article.findOne({ where: { url: req.params.url } })
    }

    async addArticle(req: Express.Request) {
        await Article.insert(req.body)
    }

    async updateArticle(req: Express.Request) {
        const article = await Article.findOne({ where: { url: req.params.url } })

        Object.assign(article, req.body)
        await article.save()
    }

    async deleteArticle(req: Express.Request) {
        await Article.delete(req.params.id)
    }
}
