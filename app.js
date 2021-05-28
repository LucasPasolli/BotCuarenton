console.log("Corriendo en terminal")

const Discord = require('discord.js');
//const { userInfo } = require('os');
const newUsers = new Discord.Collection();
const fs = require('fs');
const userData = JSON.parse(fs.readFileSync('storage/userData.json', 'utf8'));
const bot = new Discord.Client();
const botID = '847094877715300422';

function userInfo(user) {
    let finalString = '';

    finalString += '**' + user.username + '**, con la ID: **' + user.id + '**'; 

    return finalString;
}

//Avisa cuando prende el bot
bot.on('ready', () => {
    console.log('Corriendo en servidor')
    bot.user.setActivity("43 Lover", {type: 0});
});

//Seteo de prefijo
bot.on('message', message => {

    var sender = message.author;
    var msg = message.content.toLowerCase();
    var prefix = '¿'

    if (sender.id === botID) {
        return;
    }
    if (msg.startsWith(prefix)) {

        //Comando de prueba
        if (msg === prefix + 'ping') {

            message.channel.send('Pong!')   
        }
        
        if (msg === prefix + 'info') {

            message.channel.send(userInfo(sender));   
        }

        //Contador de mensajes
        if (!userData[sender.id]) userData[sender.id] = {
            messageSent:0
        }

        userData[sender.id].messageSent++;
        //escribe en el json
        fs.writeFile('storage/userData.json', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })

        if (msg === prefix + 'msgenv') {
            message.channel.send('Hola, como estas? Ví que me escribiste para saber el inutil dato de cuántos mensajes mandaste; btw mandaste: **' + userData[sender.id].messageSent + '**.')
        }

        //Comando que borra mensajes
        if (message.channel.id === '847598285962477658') {
            if ("no me gusta el 43" === (msg)) {
                message.delete()
                message.author.send('Te deseo un mal dia!')//Envia al usuario por MD
                
            }
            
        }

        if (msg.includes('verduras')) {
            message.delete()
            message.author.send('Me das asco, ojala te atragantes!')
        }
        
        if (msg.includes('¿torta')) {
            message.author.send('__**Torta de La Gorda**__ \n-Una taza chica de aceite hasta la mitad. \n-150g azúcar \n-2 huevos \n-1 banana pisada, mientras mas se parezca a una morcilla mejor \n-400g harina leudante \n-350ml leche (este es mas a ojo, tipo yo le pongo dos vasos y hay veces que necesita menos o mas)')
            //message.channel.send('Ahi te lo mande al privado monster')
            setTimeout(() => message.delete(), 5000)
            message.channel.send('Ahi te lo mande al privado REY').then(msg => {
                    msg.delete({ timeout: 5000 /*time unitl delete in milliseconds*/});
                })
        }       
    }
    
} );


//Adicion de autorol cuando usuario entra al servidor
bot.on('guildMemberAdd', guildMember =>{
    var autoRol = guildMember.guild.roles.cache.find(role => role.name === 'AutoRol');
    guildMember.roles.add(autoRol);
});

bot.on('guildMemberAdd', newMember => {
    //var username = newMember.user.username;
    var usernameID = `${newMember}`;
    const welcomeChannel = newMember.guild.channels.cache.find(channel => channel.name === 'canaldeprueba')
    welcomeChannel.send('Bienvenido '+ usernameID + ' te invito a pasarla mal!');
});

bot.on('guildMemberRemove', newMember => {
    //var username = newMember.user.username;
    var usernameID = `${newMember}`;
    const welcomeChannel = newMember.guild.channels.cache.find(channel => channel.name === 'canaldeprueba')
    welcomeChannel.send(usernameID + ' no se bancó la gira.');
});

bot.login('ODQ3MDk0ODc3NzE1MzAwNDIy.YK5ElQ.EH9iACXDQ7Ay1TD3sbvb_LKBGBg')