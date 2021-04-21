import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'
import { logger } from '../logger'
import { UserToken } from '../db/entity/userToken'
import fs from 'fs'
import ejs from 'ejs'

const EMAIL_FROM = process.env.SMTP_EMAIL
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

export default class MailService {
    static transport: Transporter = null
    static initialized = false

    static async initialize() {
        logger.info('Initializing Mail Service')
        if (!SMTP_PASSWORD) {
            logger.error('SMTP Password is not set.')
            return
        }

        this.transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: EMAIL_FROM,
                pass: SMTP_PASSWORD,
            },
        })

        this.initialized = true
    }

    static checkInitialized() {
        if (!this.initialized) logger.error('MailService was not initialized yet!')
        return this.initialized
    }

    static async sendInvite(invite: UserToken) {
        if (!this.checkInitialized()) return

        try {
            const content = await ejs.renderFile(fs.realpathSync('./dist/service/mail_template/invite_user.html.ejs'), {
                url: `${process.env.NUXT_URL}/register/${invite.token}`,
            })
            await this.transport.sendMail({
                from: EMAIL_FROM,
                to: invite.email,
                html: content,
                subject: 'Boli ste pozvaní do Študuj Dopravu',
            })
        } catch (e) {
            logger.error('error while sending email: ' + e)
            return false
        }
    }

    static async sendPasswordReset(invite: UserToken) {
        if (!this.checkInitialized()) return

        try {
            const content = await ejs.renderFile(
                fs.realpathSync('./dist/service/mail_template/request_password_reset.html.ejs'),
                {
                    url: `${process.env.NUXT_URL}/login/reset/${invite.token}`,
                },
            )
            await this.transport.sendMail({
                from: EMAIL_FROM,
                to: invite.email,
                html: content,
                subject: 'Študuj dopravu - obnova hesla',
            })
        } catch (e) {
            logger.error('error while sending email: ' + e)
            return false
        }
    }
}
