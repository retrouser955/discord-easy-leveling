# Generating an XP bar chart

Discord Easy Leveling provide a quick and easy way to generate a chart image of levels in a guild

We will start by creating a discord.js bot

```js
const { Client, Intents } = require('discord.js')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const config = {
    TOKEN: 'sUp3r-s3Cr31-t0K3n',
    PREFIX: 'your prefix'
}
client.login(config.TOKEN)
```
We can then add discord easy leveling to it (I won't go over much of this part as you can read the [readme](https://github.com/retrouser955/discord-easy-leveling#getting-started))
```js
const { Client, Intents, MessageAttachment } = require('discord.js')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const { EasyLeveling } = require('discord-easy-leveling')
const config = {
    TOKEN: 'sUp3r-s3Cr31-t0K3n',
    PREFIX: 'your prefix'
}
const options = {
    startingXP: 0,
    startingLevel: 1,
    levelUpXP: 100,
    database: 'sqlite'
}
const leveling = new EasyLeveling(client, options)
client.leveling = leveling
client.on('ready', () => {
    console.log(client.user.tag + ' is ready!')
})
client.on('messageCreate', (message) => {
    if(message.author.bot) return
    client.leveling.addLevels(message.author.id, message.guild.id, message.channel.id)
})
client.leveling.on('UserLevelUp', (newLevel, lastLevel, userId, guildId, channelId) => {
    client.channels.cache.get(channelId).send(`Congrats <@${userid}>! You have advanced to level ${newLevel}. Your old level was level ${lastLevel}`)
})
client.login(config.TOKEN)
```

We can now call the generate chart function to generate a chart with discord easy leveling

```js
client.on('messageCreate', (message) => {
    if(message.author.bot) return
    client.leveling.addLevels(message.author.id, message.guild.id, message.channel.id)
    if(message.content === '!chart') {
        const chart = await client.leveling.generateXPChart(message.guild.id, 5) // will return a buffered image
        // check the docs https://retrouser955.github.io/discord-easy-leveling/EasyLeveling.html for more info on the parameters
        const attachment = new MessageAttachment(chart, 'chart.png')
        message.reply({
            files: [attachment]
        })
    }
})
```