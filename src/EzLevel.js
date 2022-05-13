const db = require('quick.db')
// const Database = require('easy-json-database')
// const db = new Database("./db.json", {
//     snapshots: {
//         enabled: true,
//         interval: 24 * 60 * 60 * 1000,
//         folder: './backups/'
//     }
// });
const { EventEmitter } = require("events")
const events = require('./events/events.js')
class EasyLeveling extends EventEmitter {
    /**
     * Create a new Discord Easy Level
     * @param {any} client Your Discord.js Client
     * @param {object} options Discord XP level options
     */
    constructor(client, options) {
        if(!client) throw new Error('Easy Leveling Error: A valid discord client must be provided')
        super(client, options)
        this.client = client
        this.levelingAmount = options.levelingAmount || 1
        this.startingLevel = options.startingLevel || 1
        this.levelUpXP = options.levelUpXP || 100
        this.emit(events.ReadyEvent)
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
        const dbHasLevel = db.has(`${userId}-${guildId}-level`)
        if(!dbHasLevel) {
            db.set(`${userId}-${guildId}-XP`, this.startingXP)
            db.set(`${userId}-${guildId}-level`, this.startingLevel)
            return
        }
        const userLevelUp = await db.get(`${userId}-${guildId}-XP`)
        if(userLevelUp == this.levelUpXP) {
            await db.set(`${userId}-${guildId}-XP`, 0)
            const userHasLevel = db.has(`${userId}-${guildId}-level`)
            if(!userHasLevel) return await db.set(`${userId}-${guildId}-level`, 1)
            await db.add(`${userId}-${guildId}-level`, 1)
            const newLevel = db.get(`${userId}-${guildId}-level`)
            const lastLevel = newLevel - 1
            this.emit(events.UserLevelUpEvent, newLevel, lastLevel, userId, guildId, channelId)
            return
        }
        db.add(`${userId}-${guildId}-XP`, 1)
    }
    /**
     * get the level and xp of the user
     * @param {string} userId user id
     * @param {string} guildId guild id
     * @returns {object} XP and the level of the user
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
    /**
     * get all data from the database. powered by quick.db
     * @returns {string} 
     */
    async getAllData() {
        const allData = db.all()
        return allData
    }
}
module.exports = EasyLeveling