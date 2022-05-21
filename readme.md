# Discord Easy Leveling

A complete framework to implement a leveling system using discord.js v13

# Why discord-easy-leveling?

✨ Beginner friendly  
✍ Full customization  
☁  LightWeight  
🦺 Does not use your discord bot token

# Getting started!

Keep in mind that there are docs for this project [here](http://retrouser955.github.io/discord-easy-leveling)

```js
const { Client, Intents } = require('discord.js')
// create a new client with discord.js
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
const { EasyLeveling } = require('discord-easy-leveling')
const config = {
    TOKEN: 'sUp3r-s3Cr31-t0K3n'
}
// options for the package
// this can be changed based of your needs
const options = {
    startingXP: 0,
    startingLevel: 1,
    levelUpXP: 100,
    database: 'sqlite' // or 'json'
}
const leveling = new EasyLeveling(client, options)
// creating a new 'EasyLeveling' client
client.leveling = leveling
// now you can access the leveling module everywhere!
client.on('ready', () => {
    console.log(client.user.tag + ' is ready!')
})
client.on('messageCreate', (message) => {
    if(message.author.bot) return
    // will not add xp is the message author is bot
    client.leveling.addLevels(message.author.id, message.guild.id, message.channel.id)
    // add levels to message author in message guild
    // the first parameter is message author's id
    // the second parameter is message guild's id
    // the third parameter is message channel's id
})
client.leveling.on('UserLevelUp', (newLevel, lastLevel, userId, guildId, channelId) => {
    // This event is fired when a user level up
    client.channels.cache.get(channelId).send(`Congrats <@${userid}>! You have advanced to level ${newLevel}. Your old level was level ${lastLevel}`)
})
// login with discord bot token
client.login(config.TOKEN)
```

Having problems using the packge? Join our [discord server](https://discord.gg/PpPgaCZR44) to get help!