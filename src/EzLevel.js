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
const deleteModule = require('./deletedb.js')
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
        this.startingXP = options.startingXP || 1
        this.startingLevel = options.startingLevel || 1
        this.levelUpXP = options.levelUpXP || 100
    }
    /**
     * add level to your desire user
     * @param {string} userId The id of the user you want to add levels
     * @param {string} guildId The id of the guild that the user is in
     */
    async addLevels(userId, guildId, channelId) {
        try {
            if(!userId) throw new Error('Easy Leveling Error: A valid user id must be provided')
            if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
            if(!channelId) throw new Error('Easy Level Error: A valid channel id must be provided')
            const dbHasLevel = db.has(`${userId}-${guildId}-level`)
            if(!dbHasLevel) {
                db.set(`${userId}-${guildId}-user`, { XP: this.startingXP })
                db.set(`${userId}-${guildId}-user.level`, this.startingLevel)
                return
            }
            const userLevelUp = await db.get(`${userId}-${guildId}-user.XP`)
            if(userLevelUp == this.levelUpXP) {
                await db.set(`${userId}-${guildId}-XP`, 0)
                const userHasLevel = db.has(`${userId}-${guildId}-user.level`)
                if(!userHasLevel) return await db.set(`${userId}-${guildId}-user.level`, 1)
                await db.add(`${userId}-${guildId}-user.level`, 1)
                const newLevel = db.get(`${userId}-${guildId}-user.level`)
                const lastLevel = newLevel - 1
                this.emit(events.UserLevelUpEvent, newLevel, lastLevel, userId, guildId, channelId)
                return
            }
            db.add(`${userId}-${guildId}-user.xp`, 1)
        } catch (error) {
            this.emit(events.error, error, 'addLevels')
        }
    }
    /**
     * get the level and xp of the user
     * @param {string} userId user id
     * @param {string} guildId guild id
     * @returns {object} XP and the level of the user
     */
    async getUserLevel(userId, guildId) {
        try {
            if(!userId) throw new Error('Easy Level Error: A valid user id must be provided')
            if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
            const level = await db.get(`${userId}-${guildId}-user.level`)
            const xp = await db.get(`${userId}-${guildId}-user.XP`)
            const data = {
                level: level,
                xp: xp
            }
            return data
        } catch (error) {
            this.emit(events.error, error, 'getUserLevel')
        }
    }
    /**
     * force set the level of a user
     * @param {number} level 
     * @param {string} userId 
     * @param {string} guildId 
     */
    async setLevel(level, userId, guildId) {
        try {
            if(!level) throw new Error('Easy Level Error: A valid level must be provided')
            if(typeof level != "number") throw new SyntaxError('Easy Level Error: Type of level must be a number')
            if(!userId) throw new Error('Easy Level Error: A valid user id must be provided')
            if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
            await db.set(`${userId}-${guildId}-user.level`, level) 
        } catch (error) {
            this.emit(events.error, error)
        }
    }
    /**
     * force set the xp of a user
     * @param {string} xp 
     * @param {string} userId 
     * @param {string} guildId 
     */
    async setXP(xp, userId, guildId) {
        try {
            if(!xp) throw new Error('Easy Level Error: A valid xp must be provided')
            if(typeof xp != 'number') throw new SyntaxError('Easy Level Error: Type of xp must be a number')
            if(xp > this.levelUpXP) throw new Error(`Easy Level Error: Amount of XP cannot be more than ${this.levelUpXP}`)
            if(xp < 0) throw new Error(`Easy Level Error: Amount of XP cannot be more than 0`)
            await db.set(`${userId}-${guildId}-user.XP`, xp)
        } catch (error) {
            this.emit(events.error, error)
        }
    }
    /**
     * get all data from the database. powered by quick.db
     * @returns {string} 
     */
    async getAllData() {
        try {
            const allData = db.all()
            return allData
        } catch (error) {
            this.emit(events.error, error)
        }
    }
    async deleteAllData() {
        deleteModule.deleteAllData()
    }
    /**
     * will delete a user's data from the database
     * @param {string} userId the id of the user you want to delete
     * @param {string} guildId the id of the guild you want the data deleted from
     */
    async deleteUserData(userId, guildId) {
        try {
            if(!userId) throw new Error('Easy Level Error: A valid user id must be provided!')
            if(!guildId) throw new Error('Easy Level Error: A valid user guild must be provided!')
            deleteModule.deleteUserData(userId, guildId)
        } catch(err) {
            this.emit(events.error, error)
        }
    }
    /**
     * Reduce the amount of level(s) from a user
     * @param {string} userId Id of the user you want to reduce levels from
     * @param {string} guildId Id of the guild you want to reduce Levels from
     * @param {number} amount Amount of levels you want to reduce
     */
    async reduceLevels(userId, guildId, amount) {
        try {
            if(!userId) throw new Error('Easy Level Error: A valid user id must be provided!')
            if(!guildId) throw new Error('Easy Level Error: A valid user guild must be provided!')
            if(!amount) throw new Error('Easy Level Error: An amount must be provided!')
            if(typeof amount != 'number') throw new Error("Easy Level TypeError: Type of 'amount' must be a number")
            db.subtract(`${userId}-${guildId}-user.level`, amount)
        } catch (error) {
            this.emit(events.error, error)
        }
    }
    /**
     * reduce the amount of xp(s) from a user
     * @param {*} userId Id of the user you want to reduce xp from
     * @param {*} guildId Id of the guild you want to reduce xp from
     * @param {*} amount Amount of xp(s) you want to reduce
     */
    async reduceXP(userId, guildId, amount) {
        try {
            if(!userId) throw new Error('Easy Level Error: A valid user id must be provided!')
            if(!guildId) throw new Error('Easy Level Error: A valid user guild must be provided!')
            if(!amount) throw new Error('Easy Level Error: An amount must be provided!')
            if(typeof amount != 'number') throw new Error("Easy Level TypeError: Type of 'amount' must be a number")
            db.subtract(`${userId}-${guildId}-user.XP`, amount) 
        } catch (error) {
            this.emit(events.error, error)
        }
    }
}
module.exports = EasyLeveling