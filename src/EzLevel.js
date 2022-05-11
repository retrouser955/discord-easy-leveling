const db = require('quick.db')
const { EventEmitter } = require("events");
const eventEmmiter = new EventEmitter()
class EasyLeveling extends EventEmitter {
    /**
     * Create a new Discord Easy Level
     * @param {any} client Your Discord.js Client
     * @param {object} options Discord XP level options
     */
    constructor(client, options) {
        if(!client) throw new Error('Easy Leveling Error: A valid discord client must be provided')
        this.client = client
        this.levelingAmount = options.levelingAmount || 1
        this.startingXP = options.startingLevel || 1
        this.levelUpXP = options.levelUpXP || 100
    }
    /**
     * add level to your desire user
     * @param {string} userId The id of the user you want to add levels
     * @param {string} guildId The id of the guild that the user is in
     */
    async addLevels(userId, guildId, channelId) {
        if(!userId) throw new Error('Easy Leveling Error: A valid user id must be provided')
        if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
        if(!channelId) throw new Error('Easy Level Error: A valid channel id must be provided')
        const dbHasLevel = db.has(`${userId}-${guildId}-XP`)
        if(!dbHasLevel) {
            await db.set(`${userId}-${guildId}-level`, this.levelingAmount)
            return
        }
        const userLevelUp = await db.get(`${userId}-${guildId}-XP`)
        if(userLevelUp > 100) {
            await db.set(`${userId}-${guildId}-XP`, 0)
            const userHasLevel = db.has(`${userId}-${guildId}-level`)
            if(!userHasLevel) return await db.set(`${userId}-${guildId}-level`, 1)
            await db.add(`${userId}-${guildId}-level`, 1)
            const newLevel = db.get(`${userId}-${guildId}-level`)
            eventEmmiter.emit('userLevelUp', channelId, String(newLevel))
        }
    }
    /**
     * get the level and xp of the user
     * @param {string} userId user id
     * @param {string} guildId guild id
     * @returns {object}
     */
    async getUserLevel(userId, guildId) {
        if(!userId) throw new Error('Easy Level Error: A valid user id must be provided')
        if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
        const level = await db.get(`${userId}-${guildId}-level`)
        const xp = await db.get(`${userId}-${guildId}-XP`)
        const data = {
            level: level,
            xp: xp
        }
        return data
    }
    /**
     * force set the level of a user
     * @param {number} level 
     * @param {string} userId 
     * @param {string} guildId 
     */
    async setLevel(level, userId, guildId) {
        if(!level) throw new Error('Easy Level Error: A valid level must be provided')
        if(typeof level != "number") throw new SyntaxError('Easy Level Error: Type of level must be a number')
        if(!userId) throw new Error('Easy Level Error: A valid user id must be provided')
        if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
        await db.set(`${userId}-${guildId}-level`, level) 
    }
    /**
     * force set the xp of a user
     * @param {string} xp 
     * @param {string} userId 
     * @param {string} guildId 
     */
    async setXP(xp, userId, guildId) {
        if(!xp) throw new Error('Easy Level Error: A valid xp must be provided')
        if(typeof xp != 'number') throw new SyntaxError('Easy Level Error: Type of xp must be a number')
        if(xp > this.levelUpXP) throw new Error(`Easy Level Error: Amount of XP cannot be more than ${this.levelUpXP}`)
        if(xp < 0) throw new Error(`Easy Level Error: Amount of XP cannot be more than 0`)
        await db.set(`${userId}-${guildId}-XP`, xp)
    }
}
module.exports = EasyLeveling