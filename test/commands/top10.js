module.exports = {
    name: 'top10',
    description: 'displays top 10 users',
    async execute(client, message, args) {
        let leaderboard = await client.leveling.getTopUser(message.guild.id, 10)
        for (let user of leaderboard) {
            if (!user) return
            message.channel.send(`<@${ user.userId }> level: ${ user.level } xp: ${ user.xp } `)
        }

    }
}

