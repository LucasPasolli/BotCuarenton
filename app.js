console.log("Corriendo en terminal")

const { timeStamp } = require('console');
const Discord = require('discord.js');
//const { userInfo } = require('os');
//const newUsers = new Discord.Collection();
//const profanities = require('profanities');
const bot = new Discord.Client();
const botID = '847094877715300422';
const fs = require('fs');
const userData = JSON.parse(fs.readFileSync('storage/userData.json', 'utf8'));
const commandsList = fs.readFileSync('storage/botCommands.txt', 'utf8');
bot.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
    if(err) console.error(err);
    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) {
        return console.log('No commands found...')
    }
    else{
        console.log(jsfiles.length + ' comandos encontrados. ')//Dice cuantos comandos hay
    }

    jsfiles.forEach((f, i)=>{//hace un loop
        let cmds = require(`./commands/${f}`);//Toma todas las js files de la carpeta
        console.log(`Comando ${f} encontrado.`)//Dice por terminal que comando esta corriendo
        bot.commands.set(cmds.config.command, cmds);//Toma el nombre del comando
    })
})

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
    const cont = message.content.slice(prefix.length).split(" ");//separa el mensaje en un array
    const args = cont.slice(1);//toma lo que esta despues del prefijo
    const cmd = bot.commands.get(cont[0]);//toma el comando escrito en el chat

    if (!message.content.startsWith(prefix)) {//el ! devuelve un boolean
        return;
    }

    if (cmd){
        cmd.run(bot, message, args);//checkea si existe el comando y lo corre
    }

    if (sender.id === botID) {
        return;
    }

    if (!userData[sender.id]) userData[sender.id] = {
        messageSent:0
    }

    userData[sender.id].messageSent++;
        //escribe en el json
        fs.writeFile('storage/userData.json', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })

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

bot.login('ODQ3MDk0ODc3NzE1MzAwNDIy.YK5ElQ.dFzcgf7lYyBi46AZOwClBX5C-9E')
