
/**
 * This worker handles profile maintenance related activities.
 * For example building the profile and profile channels daily
 */

const moment = require('moment')

const { getPost } = require('./services/instagram-fetch')

const queue = 'post'
const version = 0
const sleep = 1000 * 60

const handler = async (doc, { ctx }) => {
    try {
        const post = await getPost(doc.subject)

        await ctx.doc.pushMany('profile', {
            docs: post.mentionsList.map(item => ([item.username]))
        })

        await ctx.doc.pushMany('profile', {
            docs: post.sponsorsList.map(item => ([item.username]))
        })

        await ctx.doc.pushMany('profile', {
            docs: post.taggedList.map(item => ([item.username]))
        })

        await ctx.doc.pushMany('profile', {
            docs: post.commentsList.map(item => ([item.ownerUsername]))
        })

        await ctx.doc.pushMany('profile', {
            docs: post.likesList.map(item => ([item.username]))
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
