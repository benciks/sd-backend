import { User } from './entity/user'
import { getConnectionManager, Connection } from 'typeorm'
import { devSeed } from './seed/devSeed'
import { testSeed } from './seed/testSeed'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'

export let connection: Connection
export const initializeDB = async () => {
    const options: SqliteConnectionOptions = {
        type: 'sqlite',
        database: './data/db.sqlite',
        entities: [User],
        synchronize: true,
        logging: true,
    }

    try {
        const connectionManager = getConnectionManager()
        connection = connectionManager.create(options)
        await connection.connect()
        console.log('🆗 Connection to Database established.')
    } catch (error) {
        console.log('❌ Error: Could not connect to Database')
        console.log(error)
    }

    await devSeed()
    if (process.env.NODE_ENV === 'develop') {
    } else if (process.env.NODE_ENV === 'test') {
        await testSeed()
    }
}
