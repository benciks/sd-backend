import { logger } from './logger'
import api from './api/api'
import { initializeDB } from './db/db'
import MailService from './service/mailService'

export default async function () {
    logger.info('Starting Template Backend!')

    //initialize DB
    await initializeDB()

    //init mailService
    await MailService.initialize()

    //start api
    await api()
}
