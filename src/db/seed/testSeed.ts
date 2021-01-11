import { sharedSeed } from './sharedSeed'
import { connection } from '../db'

export const testSeed = async () => {
    await connection.query(`DELETE FROM "user";`)

    return sharedSeed()
}
