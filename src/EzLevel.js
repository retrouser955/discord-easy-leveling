const Database = require('easy-json-database')
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
        super(client, options)
        if(!client) throw new Error('Easy Leveling Error: A valid discord client must be provided')
        if(!options) throw new Error('Easy Leveling Error: Options must be defined. Consinder reading readme.md')
        if(typeof options != 'object') throw new Error('Easy Leveling Error: Typeof options must be an object')
        // if(!options.startingXP || !options.startingLevel || !options.levelUpXP || !options.database) throw new Error('Easy Leveling Error: starting XP, starting Level or level up XP must be defined')
        this.client = client
        this.startingXP = options.startingXP || 1
        this.startingLevel = options.startingLevel || 1
        this.levelUpXP = options.levelUpXP || 100
        if(options.database == 'json') {
            this.db = new Database('./EasyLeveling.json')
	    this.dbName = 'easyJson'
        } else if(options.database == 'sqlite') {
            this.db = require('quick.db')
	    this.dbName = 'sqlite'
        } else {
            throw new Error("Easy Leveling Error: Database must be an option between a 'json' databse and a 'sqlite' database")
        }
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
        try {
            const dbHasLevel = this.db.has(`${userId}-${guildId}-level`)
            if(!dbHasLevel) {
                this.db.set(`${userId}-${guildId}-user`, { XP: this.startingXP })
                this.db.set(`${userId}-${guildId}-user.level`, this.startingLevel)
                return
            }
            const userLevelUp = await this.db.get(`${userId}-${guildId}-user.XP`)
            if(userLevelUp == this.levelUpXP) {
                await this.db.set(`${userId}-${guildId}-user.XP`, 0)
                const userHasLevel = this.db.has(`${userId}-${guildId}-user.level`)
                if(!userHasLevel) return await this.db.set(`${userId}-${guildId}-user.level`, 1)
                await this.db.add(`${userId}-${guildId}-user.level`, 1)
                const newLevel = this.db.get(`${userId}-${guildId}-user.level`)
                const lastLevel = newLevel - 1
                this.emit(events.UserLevelUpEvent, newLevel, lastLevel, userId, guildId, channelId)
                return
            }
            this.db.add(`${userId}-${guildId}-user.XP`, 1)
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
        if(!userId) throw new Error('Easy Level Error: A valid user id must be provided')
        if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
        try {
            const level = await this.db.get(`${userId}-${guildId}-user.level`)
            const xp = await this.db.get(`${userId}-${guildId}-user.XP`)
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
        if(!level) throw new Error('Easy Level Error: A valid level must be provided')
        if(typeof level != "number") throw new SyntaxError('Easy Level Error: Type of level must be a number')
        if(!userId) throw new Error('Easy Level Error: A valid user id must be provided')
        if(!guildId) throw new Error('Easy Level Error: A valid guild id must be provided')
        try {
            await this.db.set(`${userId}-${guildId}-user.level`, level) 
        } catch (error) {
            this.emit(events.error, error, 'setLevel')
        }
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
        try {
            await this.db.set(`${userId}-${guildId}-user.XP`, xp)
        } catch (error) {
            this.emit(events.error, error, 'setXP')
        }
    }
    /**
     * get all data from the database. powered by quick.db
     * @returns {string} 
     */
    async getAllData() {
        try {
            const allData = this.db.all()
            return allData
        } catch (error) {
            this.emit(events.error, error, 'getAllData')
        }
    }
    async deleteAllData() {
        deleteModule.deleteAllData(this.db, this.dbName)
    }
    /**
     * will delete a user's data from the database
     * @param {string} userId the id of the user you want to delete
     * @param {string} guildId the id of the guild you want the data deleted from
     */
    async deleteUserData(userId, guildId) {
        if(!userId) throw new Error('Easy Level Error: A valid user id must be provided!')
        if(!guildId) throw new Error('Easy Level Error: A valid user guild must be provided!')
        try {
            deleteModule.deleteUserData(userId, guildId, this.db)
        } catch(err) {
            this.emit(events.error, error, 'deleteUserData')
        }
    }
    /**
     * Reduce the amount of level(s) from a user
     * @param {string} userId Id of the user you want to reduce levels from
     * @param {string} guildId Id of the guild you want to reduce Levels from
     * @param {number} amount Amount of levels you want to reduce
     */
    async reduceLevels(userId, guildId, amount) {
        if(!userId) throw new Error('Easy Level Error: A valid user id must be provided!')
        if(!guildId) throw new Error('Easy Level Error: A valid user guild must be provided!')
        if(!amount) throw new Error('Easy Level Error: An amount must be provided!')
        if(typeof amount != 'number') throw new Error("Easy Level TypeError: Type of 'amount' must be a number")
        try {
            db.subtract(`${userId}-${guildId}-user.level`, amount)
        } catch (error) {
            this.emit(events.error, error, 'reduceLevels')
        }
    }
    /**
     * reduce the amount of xp(s) from a user
     * @param {string} userId Id of the user you want to reduce xp from
     * @param {string} guildId Id of the guild you want to reduce xp from
     * @param {number} amount Amount of xp(s) you want to reduce
     */
    async reduceXP(userId, guildId, amount) {
        if(!userId) throw new Error('Easy Level Error: A valid user id must be provided!')
        if(!guildId) throw new Error('Easy Level Error: A valid user guild must be provided!')
        if(!amount) throw new Error('Easy Level Error: An amount must be provided!')
        try {
            if(typeof amount != 'number') throw new Error("Easy Level TypeError: Type of 'amount' must be a number")
            db.subtract(`${userId}-${guildId}-user.XP`, amount) 
        } catch (error) {
            this.emit(events.error, error, 'reduceXP')
        }
    }
}
module.exports = EasyLeveling