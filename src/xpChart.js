const ChartJSImage = require('chart.js-image')
async function generateChartImage(dbName, db, amount, guildId, client) {
    if(dbName == 'json') {
        const allData = await db.all()
        let chartArrayUsers = []
        let chartArrayAmount = []
        let data = []
        for(const key of allData) {
            if(String(key.key).includes(guildId)) {
                if(String(key.key).includes(guildId)) {
                    data.push({
                        xpOverTime: key.data.XPoverTime,
                        userId: key.data.userId,
                        level: key.data.level,
                        xp: key.data.XP
                    })
                }
            }
        }
        data.sort((a, b) => {
            return b.xpOverTime - a.xpOverTime
        })
        for(let i = 0; i < amount; i++) {
            if(data[i].userId) {
                const username = client.users.cache.get(data[i].userId).username
                chartArrayUsers.push(username)
                if(data[i].xpOverTime) chartArrayAmount.push(data[i].xpOverTime)
            }
        }
        const chartBar = ChartJSImage().chart({
            type: 'bar',
            data: {
                labels: chartArrayUsers,
                datasets: [{
                    label: 'Chart of users',
                    data: chartArrayAmount
                }]
            }
        })
        return chartBar.toBuffer()
    } else {
        const allData = await db.all()
        let chartArrayUsers = []
        let chartArrayAmount = []
        let data = []
        for(const key of allData) {
            if(String(key.ID).includes(guildId)) {
                if(String(key.key).includes(guildId)) {
                    data.push({
                        xpOverTime: key.data.XPoverTime,
                        userId: key.data.userId,
                        level: key.data.level,
                        xp: key.data.XP
                    })
                }
            }
        }
        data.sort((a, b) => {
            return b.xpOverTime - a.xpOverTime
        })
        for(let i = 0; i < amount; i++) {
            if(data[i].userId) {
                const username = client.users.cache.get(data[i].userId).username
                chartArrayUsers.push(username)
                if(key.data.XPoverTime) chartArrayAmount.push(key.data.XPoverTime)
            }
        }
        const chartBar = ChartJSImage().chart({
            type: 'bar',
            data: {
                labels: chartArrayUsers,
                datasets: [{
                    label: 'Chart of users',
                    data: chartArrayAmount
                }]
            }
        })
        return chartBar.toBuffer()
    }
}
module.exports = generateChartImage