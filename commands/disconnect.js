module.exports.run = async (bot, message, args, ops) => {
    
    if (message.channel.type === 'dm') {
        message.channel.send('No se puede utilizar este comando en DM.');
    }
    else{
        if (!message.member.voice.channel) return message.channel.send('Tenes que estar conectado a un canal!');
        if (!message.guild.me.voice.channel) return message.channel.send('El bot no esta conectado a un canal!');
        if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send('No estas conectado al mismo canal que el bot.');
        message.guild.me.voice.channel.leave();
        message.channel.send('Nos re vimo gato.')        
    }
}

module.exports.config = {
    command:"disconnect"
}

