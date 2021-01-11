import pino from 'pino'

export const logger = pino({
    prettyPrint: {
        colorize: true,
        ignore: 'hostname,pid',
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    },
    level: 'debug',
})
