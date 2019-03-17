
/**
 * This worker handles profile maintenance related activities.
 * For example building the profile and profile channels daily
 */

const moment = require('moment')

const { getProfile } = require('./services/instagram-fetch')

const queue = 'profile'
const version = 0
const sleep = 1000 * 60

const handler = async (doc, { ctx }) => {
    try {
        const profile = await getProfile(doc.subject)
        
        await ctx.doc.pushMany(queue, {
            docs: profile.mentionsList.map(item => ([item])),
        })

        await ctx.doc.pushMany('post', {
            docs: profile.postsList.map(item => ([item.code]))
        })
    } catch (err) {
        throw new Error(err)
    }

    return {
        action: 'complete',
        // nextIteration: moment().add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss Z')
    }
}

module.exports = {
    queue,
    version,
    sleep,
    handler,
}
