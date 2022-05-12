const { Client: DiscordClient, Intents } = require('discord.js')
const client = new DiscordClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const { EasyLeveling } = require('../index.js')
const options = {
    levelingAmount: 1,
    startingXP: 1,
    levelUpXP: 20
}
const leveling = new EasyLeveling(client, options)
client.on('messageCreate', (message) => {
    leveling.addLevels(message.author.id, message.guild.id, message.channel.id)
})
leveling.on('userLevelUp', (channelId, newLevel) => {
    client.channels.cache.get(channelId).send(`level ${newLevel}`)
})
client.login('')
