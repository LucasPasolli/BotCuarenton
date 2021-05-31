const fs = require('fs');
const Discord = require('discord.js');
const userData = JSON.parse(fs.readFileSync('storage/userData.json', 'utf8'));

module.exports.run = async (bot, message, args) => {
    var sender = message.author;
    setTimeout(() => message.delete(), 5000)
    message.channel.send('Hola, como estas? Ví que me escribiste para saber el inutil dato de cuántos mensajes mandaste; btw mandaste: **' + userData[sender.id].messageSent + '**.').then(msg => {
        msg.delete({ timeout: 50000});
    })
}

module.exports.config = {
    command:"msgenv"
}