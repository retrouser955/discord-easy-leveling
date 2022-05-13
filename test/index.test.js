const { Client: DiscordClient, Intents } = require('discord.js')
const client = new DiscordClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const { EasyLeveling } = require('../index.js')
const config = require('./config.json')
const options = {
    startingXP: 0,
    startingLevel: 1,
    levelUpXP: 10
}
client.leveling = new EasyLeveling(client, options)
client.on('ready', () => {
    console.log(client.user.tag + ' is ready!')
})
.on('messageCreate', (message) => {
    client.leveling.addLevels(message.author.id, message.guild.id, message.channel.id)
})
client.leveling.on('UserLevelUp', (newLevel, lastLevel, userId, guildId, channelId) => {
    client.channels.cache.get(channelId).send(`level ${newLevel}`)
})
client.login(config.TOKEN)