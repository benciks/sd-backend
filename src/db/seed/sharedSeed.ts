import { User } from '../entity/user'
import bcrypt from 'bcrypt'
import { logger } from '../../logger'

export const sharedSeed = async () => {
    if ((await User.count()) === 0) {
        logger.debug('Seeding the db...')
        const u1 = new User()
        u1.name = process.env.USER_NAME
        u1.email = process.env.USER_EMAIL
        u1.password = bcrypt.hashSync(process.env.USER_PASS, 10)
        await u1.save()
    }
}
