const fs = require('fs');
const Discord = require('discord.js');
const userData = JSON.parse(fs.readFileSync('storage/userData.json', 'utf8'));


module.exports.run = (bot, message, args) => {
    
    function userInfo(user) {
        let finalString = '';
        finalString += 'El usuario: "**' + user.username + '**", con la ID: **' + user.id + '**. '; 
        let userCreated = user.createdAt.toString().split(' ');
        finalString += 'Creó su cuenta en **' + userCreated[1] + ' ' + userCreated[2] + ', del ' + userCreated[3] + '**. Y **envió ' + userData[user.id].messageSent + ' mensajes** en el servidor Cuarentón. '
        return finalString;
    }
    var sender = message.author;
    setTimeout(() => message.delete(), 5000)
    message.channel.send(userInfo(sender)).then(msg => {
        msg.delete({ timeout: 50000});
    });  
}

module.exports.config = {
    command:"info"
}

