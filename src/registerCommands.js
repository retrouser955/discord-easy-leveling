const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9'); 
class RegisterCommands {
    /**
     * Easily register slash commands
     * @param {Array<object>} commands Array of commands needed to register slash commands
     * @param {string} token Token needed by rest to register slash commands
     * @param {string} clientID Client id of the bot
     */
    constructor(commands, token, clientID) {
        if(!commands) throw new Error('Register Commands error: Array of commands must be provided')
        if(!token) throw new Error('Register Commands error: a valid discord bot token must be provided')
        if(!clientID) throw new Error('Register Commands error: a valid discord bot client id must be provided')
        this.commands = commands
        this.rest = new REST({ version: '9' }).setToken(token)
        this.id = clientID
    }
    /**
     * Register slash commands
     * @param {string} guildId ID of the guild you want to register slash in
     */
    async register(guildId) {
        if(!guildId) {
            await this.rest.put(
                Routes.applicationCommands(this.id),
                { body: this.commands }
            )
        } else {
            await this.rest.put(
                Routes.applicationGuildCommands(this.id, guildId),
                { body: this.commands }
            )
        }
    }
}
module.exports = RegisterCommands