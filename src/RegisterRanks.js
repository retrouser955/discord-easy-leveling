const { db } = require('./EzLevel.js')
class RegisterRanks {
    /**
     * Create a new Register Rank
     */
    constructor() {
        this.hello = null
    }
    async register(guildId, level, name) {
        if(!guildId) throw new Error('RegisterRanking Error: Guild id must be a valid discord guild id')
        if(!level) throw new Error('RegisterRanking Error: level must be defined')
        if(!name) throw new Error('RegisterRanking Error: Name of the rank must be defined')
        if(typeof level != 'number') throw new TypeError('RegisterRanking TypeError: Level must be a number')
        const dbHas = db.has(`${guildId}-rankings`)
        if(!dbHas) {
            await db.set(`${guildId}-rankings`, { hello: "World" })
            await db.set(`${guildId}-rankings.${name}`, level)
            await db.delete(`${guildId}-rankings.hello`)
        } else {
            await db.set(`${guildId}-rankings.${name}`, level)
        }
    }
    async unregister(guildId, name) {
        if(!guildId) throw new Error('RegisterRanking Error: Guild id must be a valid discord guild id')
        if(!name) throw new Error('RegisterRanking Error: Name of the rank must be defined')
        if(!db.has(`${guildId}-rankings.${name}`)) return console.warn(
            'RegisterRanking Warning: The name you have provied doesn\'t exist in the database. Cancelling the function'
        )
        await db.delete(`${guildId}-rankings.${name}`)
    }
}
module.exports = RegisterRanks