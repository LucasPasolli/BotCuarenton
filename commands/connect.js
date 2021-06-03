const ytdl = require("ytdl-core");

module.exports.run = async (bot, message, args, ops) => {
  if (message.channel.type === "dm") {
    message.channel.send("No se puede utilizar este comando en DM.");
  } else {
    if (!message.member.voice.channel)
      return message.channel.send("Tenes que estar conectado a un canal!");
    if (message.guild.me.voice.channel)
      return message.channel.send("Ya esta conectado a un canal!");
    if (!args[0]) return message.channel.send("Ingrese una URL!");
    let validate = await ytdl.validateURL(args[0]);
    if (!validate) return message.channel.send("Ingrese una URL válida!");
    let info = await ytdl.getInfo(args[0]);
    let connection = await message.member.voice.channel.join();
    let dispatcher = await connection.play(
      ytdl(args[0], { filter: "audioonly" })
    );
    message.channel.send(`Se está reproduciendo: ${info.videoDetails.title}`);
  }
};

module.exports.config = {
  command: "connect",
};
