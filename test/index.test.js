const { Client: DiscordClient, Intents } = require('discord.js')
const client = new DiscordClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const { EasyLeveling } = require('../index.js')
const config = require('./config.json')
const options = {
    startingXP: 0,
    startingLevel: 1,
    levelUpXP: 10,
    database: 'json'
}
client.leveling = new EasyLeveling(client, options)
client.on('ready', () => {
    console.log(client.user.tag + ' is ready!')
})
.on('messageCreate', (message) => {
    if(message.author.bot) return
    client.leveling.addLevels(message.author.id, message.guild.id, message.channel.id)
    if(message.content === '!top10') {
        client.leveling.getTopUser(message.guild.id, 10)
    }
})
client.leveling.on('UserLevelUp', (newLevel, lastLevel, userId, guildId, channelId) => {
    client.channels.cache.get(channelId).send(`Congrats <@${userId}>! You have advanced to level ${newLevel}. Your old level was level ${lastLevel}`)
})
client.leveling.on('error', (e, functionName) => {
    console.log(`An error occoured at the function ${functionName}. The error is as follows`)
    console.log(e)
})
client.login(config.TOKEN)