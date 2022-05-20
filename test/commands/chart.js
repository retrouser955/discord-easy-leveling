const { MessageAttachment } = require('discord.js')
module.exports = {
    name: 'chart',
    description: 'displays a chart of user data',
    async execute(client, message, args) {
        let chart = await client.leveling.generateXPChart(message.guild.id, 1)
        const attachment = new MessageAttachment(chart, 'chart.png')
        message.reply({
            files: [attachment]
        })
    }
}