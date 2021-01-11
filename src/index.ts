import { logger } from './logger'
import api from './api/api'
import { initializeDB } from './db/db'

export default async function () {
    logger.info('Starting Template Backend!')

    //initialize DB
    await initializeDB()

    //start api
    await api()
}
