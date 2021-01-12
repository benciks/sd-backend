import { User } from './entity/user'
import { getConnectionManager, Connection } from 'typeorm'
import { devSeed } from './seed/devSeed'
import { testSeed } from './seed/testSeed'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export let connection: Connection
export const initializeDB = async () => {
    const options: PostgresConnectionOptions = {
        type: 'postgres',
        entities: [User],
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_PORT,
        password: process.env.DB_PASS,
        synchronize: true,
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