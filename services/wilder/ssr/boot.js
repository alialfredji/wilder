import {
    createHook,
    registerAction,
    createHookApp,
    logBoot,
    SETTINGS,
    FINISH,
} from '@marcopeg/hooks'
import * as config from '@marcopeg/utils/lib/config'

const services = [
    require('./services/env'),
    require('./services/logger'),
    require('./services/express'),
    require('./services/fetchq'),
]

const features = []

const workers = [
    require('./workers/profile'),
    require('./workers/post'),
]

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        settings.express = {
            nodeEnv: config.get('NODE_ENV', 'development'),
            port: config.get('EXPRESS_PORT', '8080'),
        }

        settings.fetchq = {
            logLevel: config.get('LOG_LEVEL', 'info'),
            connect: {
                host: config.get('PG_HOST', 'localhost'),
                port: config.get('PG_PORT', 5432),
                database: config.get('PG_DB', 'wilder'),
                user: config.get('PG_USER', 'wilder'),
                password: config.get('PG_PASSWORD', 'wilder'),
            },
            maintenance: {
                limit: 3,
                sleep: 1500,
            },
            workers,
        }
    },
})

registerAction({
    hook: FINISH,
    name: '♦ boot',
    handler: () => logBoot(),
})

export default createHookApp({
    settings: { cwd: process.cwd() },
    services,
    features,
})
