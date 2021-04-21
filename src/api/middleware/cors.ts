import cors from 'cors'
import { app } from '../api'

export function registerCors() {
    const corsMiddleware = cors({
        origin:
            process.env.NODE_ENV === 'production'
                ? ['https://', 'http://localhost:8080', 'http://simon-sd-landing.server2.trail.group/']
                : ['localhost', 'localhost:3000', 'localhost:3001', 'http://localhost:8080'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Authorization', 'content-type'],
    })

    app.use(corsMiddleware)
    app.options('*', corsMiddleware)
}
