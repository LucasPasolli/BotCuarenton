//node app.js
console.log("RadioCheck")

//const { channel } = require('diagnostic_channel');
var Discord = require('discord.js'); 
var bot = new Discord.Client();
var botID = '847094877715300422';

//Avisa cuando prende el bot
bot.on('ready', () => {
    console.log('Now Online...')
});


//Seteo de prefijo
bot.on('message', message => {

    var sender = message.author;
    var msg = message.content.toLowerCase();
    var prefix = '¿'

    if (sender.id === botID) {
        return;
    }

    //Comando de prueba
    if (msg === prefix + 'ping') {

        message.channel.send('Pong!')   
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
   
} );

bot.on('guildMemberAdd', member => {
    console.log('User ' + member.username + ' has joined the server!') 
})

bot.login('ODQ3MDk0ODc3NzE1MzAwNDIy.YK5ElQ.p7gwRJfqs9aEnLg0l8ETNW2f7TM')