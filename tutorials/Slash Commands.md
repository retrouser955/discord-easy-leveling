# Creating slash commands with discord-easy-leveling

Discord Easy Leveling provide a easy way to register slash commands

```js
const { RegisterCommands } = require('discord-easy-leveling')
const { SlashCommandBuilder } = require('@discordjs/builders')
const command = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('hello world')
let commands = []
commands.push(command.toJSON())
const slashCommand = new RegisterCommands(commands, 'token', 'clientId')
(async () => {
    console.log('Registering slash commands')
    try {
        await slashCommand.register()
        console.log('Finished registering slash commands')
    } catch (err) {
        console.log(err)
    }
})()
```

# Using different files to register slash commands

In your command files add a `data` property

```js
// in your command file
const { SlashCommandBuilder } = require('@discordjs/builders')
module.exports = {
    name: 'ping',
    description: 'Test the bot with this command',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test the bot with this command'),
    async execute(interaction, client) {
        interaction.reply('🏓 | Pong!')
    }
}
```

In the main file or any file used to deploy slash commands

```js
const { RegisterCommands } = require('discord-easy-leveling')
const fs = require('fs')
const commandFile = fs.readdirSync('./commands' /** or your command folder **/).filter(file => file.endsWith('.js'))
let commands = []
for(const file of commandFile) {
    const command = require(`./commands/${file}`)
    commands.push(commad.data.toJSON())
}
const slashCommands = new RegisterCommands(commands, 'token', 'client id')
async function register() {
    console.log('Started registering slash commands')
    try {
        await slashCommands.register()
        console.log('Finished refreshing slash commands!')
    } catch (e) {
        console.error(e)
    }
}
register()
```
And that's it!