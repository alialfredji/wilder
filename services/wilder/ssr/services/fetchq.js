const moment = require('moment')
const fetchq = require('fetchq')

const { INIT_SERVICES, SERVICE, START_SERVICES } = require('@marcopeg/hooks')

let client = null

const KNOWN_QUEUES = {
    profile: 'profile',
    post: 'post',
}

const init = (config) => {
    client = fetchq(config)
}

const start = async () => {
    try {
        // make sure fetchq is properly initialized
        await client.start()

        await client.init()
        await client.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        // upsert all the queues that we need
        const initQueuesPromises = Object.keys(KNOWN_QUEUES)
            .map(key => KNOWN_QUEUES[key])
            .map(name => client.queue.create(name))
        await Promise.all(initQueuesPromises)

        // upsert all the queues that we need
        const activateQueuesNotificationsPromises = Object.keys(KNOWN_QUEUES)
            .map(key => KNOWN_QUEUES[key])
            .map(name => client.queue.enableNotifications(name, true))
        await Promise.all(activateQueuesNotificationsPromises)
    } catch (err) {
        console.log('Problem starting fetchq, retrying in 3 seconds')
        setTimeout(start, 3000)
    }
}


const getClient = () => client

const register = ({ registerAction }) => {
    const FEATURE_NAME = `${SERVICE} fetchq`

    registerAction({
        hook: INIT_SERVICES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ fetchq }) => init(fetchq),
    })

    registerAction({
        hook: START_SERVICES,
        name: FEATURE_NAME,
        trace: __filename,
        handler: () => start(),
    })
}

module.exports = {
    register,
    getClient,
}
