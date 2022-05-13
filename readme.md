# Discord Easy Leveling

A complete framework to make a leveling system using discord.js v13

# Why discord-easy-leveling?

✨ Beginner friendly  
✍ Full customization  
☁  LightWeight  
🦺 Does not use your discord bot token

# Getting started!

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
    levelUpXP: 100
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
    // will will add xp is the message author is bot
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

## Getting a user's data

To get a user's data, we can call the `getUserLevel` function.

```js
const data = client.leveling.getUserLevel()
console.log(data)
//will return an object with the user's xp and level
```

## Force setting a user's level and XP

```js
// the first parameter is the amount of level
// the second parameter is the id of a user
// the third parameter is the id of the guild
client.leveling.setLevel(level, userId, guildId)
client.leveling.setXP(level, userId, guildId)
```

## Getting all data

This will get all the data from the database.

```js
const data = client.leveling.deleteAllData()
console.log(data)
```

## Deleting all data

⚠ This will delete all data present in the database. Use this when you are sure that you want to delete the all data.

```js
client.leveling.deleteAllData()
```

## Deleting a user's data

This function will delete a user's data from the database.

```js
client.leveling.deleteUserData(userId, guildId)
```

## Reducing a user's level(s)

This function will reduce a user's level by a given amount.

```js
client.leveling.reduceLevels(amount, guildId, amount)
```

## Reducing a user's XP(s)

This function will reduce a user's XP by a given amount.

```js
client.leveling.reduceXP(amount, guildId, amount)
```