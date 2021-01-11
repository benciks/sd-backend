import { initializeDB } from '../db/db'
import server, { appServer } from '../api/api'
import axios from 'axios'
import { User } from '../db/entity/user'
import jwt from 'jsonwebtoken'
import { JWTSecret } from '../api/handler/authHandler'

before('Testing Setup', async function () {
    this.timeout(5000)
    process.env.NODE_ENV = 'test'

    await initializeDB()
    await server(3001)

    const users = await User.find()
    testData.user = {
        u1: users[0].id,
        u2: users[1].id,
    }
})

after('Teardown', async function () {
    appServer.close()
})

export const api = axios.create({
    baseURL: 'http://127.0.0.1:3001/',
})

export const testData = {
    user: {
        u1: '',
        u2: '',
    },
}

let auth: string = null
export async function setAuth(userId?: string) {
    if (userId === null) {
        auth = null
        return
    }

    const payload = { userId } as JWTPayload

    auth = jwt.sign(payload, JWTSecret)
}

api.interceptors.request.use((cfg) => {
    if (auth) cfg.headers.Authorization = auth

    console.log(`▶ ${cfg.url} : ${cfg.data ? JSON.stringify(cfg.data) : ''} as ${auth}`)

    return cfg
})
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return error.response
    },
)
