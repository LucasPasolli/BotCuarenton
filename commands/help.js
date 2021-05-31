const fs = require('fs');
const Discord = require('discord.js');
const commandsList = fs.readFileSync('storage/botCommands.txt', 'utf8');

module.exports.run = async (bot, message, args) => {
    if (message.channel.type === 'dm') {
        message.channel.send(commandsList)
    }
    else{
        setTimeout(() => message.delete(), 5000)
        message.channel.send(commandsList).then(msg => {
            msg.delete({ timeout: 50000});
        })
    }
}

module.exports.config = {
    command:"help"
}