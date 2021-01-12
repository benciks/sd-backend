import cors from 'cors'
import { app } from '../api'

export function registerCors() {
    const corsMiddleware = cors({
        origin: process.env.NODE_ENV === 'production' ? 'https://' : ['localhost', 'localhost:3000', 'localhost:3001'],
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['Authorization', 'content-type'],
    })

    app.use(corsMiddleware)
    app.options('*', corsMiddleware)
}