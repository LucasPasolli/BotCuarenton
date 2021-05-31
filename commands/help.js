const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    setTimeout(() => message.delete(), 5000)
        message.channel.send(commandsList).then(msg => {
            msg.delete({ timeout: 50000});
        })
}

module.exports.config = {
    command:"help"
}