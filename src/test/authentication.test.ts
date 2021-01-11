import { expect } from 'chai'
import { api, setAuth, testData } from './setup.test'
import jwt from 'jsonwebtoken'
import { JWTSecret } from '../api/handler/authHandler'
import { User } from '../db/entity/user'

beforeEach(async function () {
    await setAuth(null)
})

describe('API', function () {
    it('is running', async () => {
        const res = await api.get('/')
        expect(res.status).eq(200)
    })
})

describe('Authentication', function () {
    it('rejects wrong json body', async function () {
        let res = await api.post('/auth', null)
        expect(res.status).eq(415)

        res = await api.post('/auth', {})
        expect(res.status).eq(400)

        res = await api.post('/auth', { email: 'test@test.at' })
        expect(res.status).eq(400)

        res = await api.post('/auth', { email: 'test' })
        expect(res.status).eq(400)

        res = await api.post('/auth', {
            email: 'felix@dokedu.org',
            password: '1234',
        })
        expect(res.status).eq(400)
    })
    describe('/auth', function () {
        it('accepts right credentials and returns jwt', async function () {
            const res = await api.post<LoginResponse>('/auth', {
                email: 'felix@dokedu.org',
                password: '12345678',
            })
            expect(res.status).eq(200)
            expect(res.data).key('jwt')

            //check if jwt is valid
            try {
                jwt.verify(res.data.jwt, JWTSecret)
            } catch (e) {
                expect.fail('jwt not signed properly')
            }

            //check jwt body
            const payload = jwt.decode(res.data.jwt) as JWTPayload
            expect(payload.userId).eq((await User.findOne({ email: 'felix@dokedu.org' })).id)
        })
        it('rejects wrong credentials', async function () {
            const res = await api.post<LoginResponse>('/auth', {
                email: 'felix@dokedu.org',
                password: 'ree',
            })
            expect(res.status).eq(400)
        })
    })

    describe('user/me', function () {
        it('reject unauthenticated calls', async function () {
            const res = await api.get('/users/me')
            expect(res.status).eq(401)
            expect(res.data.error).contain('Access Denied')
        })

        it('allows a user to retrieve information about herself', async function () {
            await setAuth(testData.user.u1)
            const user = await User.findOne(testData.user.u1)
            const res = await api.get<IUser>('/users/me')
            expect(res.status).eq(200)
            expect(res.data.id).eq(user.id)
            expect(res.data.email).eq(user.email)
        })
    })
})
