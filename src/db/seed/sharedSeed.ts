import { User } from '../entity/user'
import bcrypt from 'bcrypt'
import { logger } from '../../logger'

export const sharedSeed = async () => {
    if ((await User.count()) === 0) {
        logger.debug('Seeding the db...')
        const u1 = new User()
        u1.email = 'felix@dokedu.org'
        u1.password = bcrypt.hashSync('12345678', 10)
        await u1.save()

        const u2 = new User()
        u2.email = 'tom@dokedu.org'
        u2.password = bcrypt.hashSync('12345687', 10)
        await u2.save()
    }
}
