const { Client: DiscordClient, Intents } = require('discord.js')
const client = new DiscordClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const { EasyLeveling } = require('../index.js')
const config = require('./config.json')
const options = {
    levelingAmount: 1,
    startingXP: 1,
    levelUpXP: 20
}
client.leveling = new EasyLeveling(client, options)
client.on('messageCreate', (message) => {
    client.leveling.addLevels(message.author.id, message.guild.id, message.channel.id)
})
client.leveling.on('UserLevelUp', (newLevel, lastLevel, userId, guildId, channelId) => {
    client.channels.cache.get(channelId).send(`level ${newLevel}`)
    console.log('level emmiter fired!')
})
client.login(config.TOKEN)