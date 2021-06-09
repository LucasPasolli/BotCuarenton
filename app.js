console.log("Corriendo en terminal");

const { timeStamp } = require("console");
const Discord = require("discord.js");
const { lookup } = require("dns");
const bot = new Discord.Client();
const botID = "847094877715300422";
const fs = require("fs");
const userData = JSON.parse(fs.readFileSync("storage/userData.json", "utf8"));
const queue = new Map();
const ytdl = require("ytdl-core");
const { YTSearcher } = require("ytsearcher");

const searcher = new YTSearcher({
  key: "AIzaSyDaOz-_N9ZQ3-Q1eAY9fdfzKISvi_l3vTA",
  revealed: true,
});

//const commandsList = fs.readFileSync('storage/botCommands.txt', 'utf8');
bot.commands = new Discord.Collection();

//Avisa cuando prende el bot
bot.on("ready", () => {
  console.log("Corriendo en servidor");
  bot.user.setActivity("Around the World", { type: 2 });
});

function loadCommands() {
  fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);
    let jsfiles = files.filter((f) => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
      return console.log("No commands found...");
    } else {
      console.log(jsfiles.length + " comandos encontrados. "); //Dice cuantos comandos hay
    }

    jsfiles.forEach((f, i) => {
      //hace un loop
      delete require.cache[require.resolve(`./commands/${f}`)]; //borra el cache para poder cargar otro comando
      let cmds = require(`./commands/${f}`); //Toma todas las js files de la carpeta
      console.log(`Comando ${f} encontrado.`); //Dice por terminal que comando esta corriendo
      bot.commands.set(cmds.config.command, cmds); //Toma el nombre del comando
    });
  });
}

loadCommands();

//Seteo de prefijo
bot.on("message", async (message) => {
  const serverQueue = queue.get(message.guild.id);

  var sender = message.author;
  var msg = message.content.toLowerCase();
  const prefix = "¿";
  const cont = message.content.slice(prefix.length).trim().split(/ +/g); //separa el mensaje en un array
  console.log(cont);
  const args = cont.slice(1); //toma lo que esta despues del prefijo
  console.log(args);
  const cmd = bot.commands.get(cont[0]);

  const argsM = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandM = argsM.shift().toLowerCase();

  switch (commandM) {
    case "play":
      execute(message, serverQueue);
      break;
    case "stop":
      stop(message, serverQueue);
      break;
    case "skip":
      skip(message, serverQueue);
      break;
    case "pause":
      pause(serverQueue);
      break;
    case "resume":
      resume(serverQueue);
      break;
    case "loop":
      loop(argsM, serverQueue);
    case "queue":
      queueCmd(serverQueue);
  }

  async function execute(message, serverQueue) {
    let vc = message.member.voice.channel;
    if (!vc) {
      return message.channel.send("Tenes que estar conectado a un canal!");
    } else {
      let result = await searcher.search(argsM.join(" "), { type: "video" });
      const songInfoM = await ytdl.getInfo(result.first.url);
      let song = {
        title: songInfoM.videoDetails.title,
        url: songInfoM.videoDetails.video_url,
      };
      if (!serverQueue) {
        const queueConstructor = {
          txtChannel: message.channel,
          vChannel: vc,
          connection: null,
          songs: [],
          volume: 10,
          playing: true,
          loopone: false,
          loopall: false,
        };
        queue.set(message.guild.id, queueConstructor);
        queueConstructor.songs.push(song);
        try {
          let connection = await vc.join();
          queueConstructor.connection = connection;
          play(message.guild, queueConstructor.songs[0]);
        } catch (err) {
          console.error(err);
          queue.delete(message.guild.id);
          return message.channel.send(`No se pudo conectar al canal ${err}`);
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(`Canción añadida: ${song.url}`);
      }
    }
  }

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.vChannel.leave();
      queue.delete();
      return;
    }
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        if (serverQueue.loopone) {
          play(guild, serverQueue.songs[0]);
        } else if (serverQueue.loopall) {
          serverQueue.songs.push(serverQueue.songs[0]); //pone la cancion en posicion 0 al final del array
          serverQueue.songs.shift(); //borra la cancion en posicion 0 y mueve todas las canciones una posicion atras
        } else {
          serverQueue.songs.shift();
        }
        // serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      });
    serverQueue.txtChannel.send(
      `Se está reproduciendo: ${serverQueue.songs[0].url}`
    );
  }

  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send("Tenes que estar conectado a un canal!");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send("Tenes que estar conectado a un canal!");

    if (!serverQueue)
      return message.channel.send("No hay nada para hacer skip!");
    serverQueue.connection.dispatcher.end();
  }

  function pause(serverQueue) {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      serverQueue.connection.dispatcher.resume();
      message.channel.send("Pausado...");
    }
    if (!serverQueue.connection) {
      return message.channel.send(
        "No se esta reproduciendo nada en estos momentos..."
      );
    }
    if (!message.member.voice.channel) {
      return message.channel.send("Tenes que estar conectado a un canal!");
    }
    if (serverQueue.connection.dispatcher.pause()) {
      return message.channel.send("Ya esta pausado...");
    }
  }

  function resume(serverQueue) {
    if (!serverQueue.connection) {
      return message.channel.send(
        "No se esta reproduciendo nada en estos momentos..."
      );
    }
    if (!message.member.voice.channel) {
      return message.channel.send("Tenes que estar conectado a un canal!");
    }
    if (serverQueue.connection.dispatcher.resume()) {
      return message.channel.send("Ya esta reproduciendose...");
    }
    if (serverQueue && !serverQueue.playing) {
      serverQueue.connection.dispatcher.pause();
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      message.channel.send("Reproduciendose...");
    }
  }

  function loop(argsM, serverQueue) {
    if (!serverQueue.connection) {
      return message.channel.send(
        "No se esta reproduciendo nada en estos momentos..."
      );
    }
    if (!message.member.voice.channel) {
      return message.channel.send("Tenes que estar conectado a un canal!");
    }
    switch (argsM[0].toLowerCase()) {
      case "all":
        serverQueue.loopall = !serverQueue.loopall;
        serverQueue.loopone = false;

        if (serverQueue.loopall === true) {
          message.channel.send("Se activó el Loop en toda la cola. ");
        } else {
          message.channel.send("Se desactivó el Loop en toda la cola. ");
        }
        break;

      case "one":
        serverQueue.loopone = !serverQueue.loopone;
        serverQueue.loopall = false;

        if (serverQueue.loopall === true) {
          message.channel.send("Se activó el Loop en una sola canción. ");
        } else {
          message.channel.send("Se desactivó el Loop en una sola canción. ");
        }
        break;

      case "off":
        serverQueue.loopall = false;
        serverQueue.loopone = false;
        message.channel.send("Se desactivó la función Loop. ");
        break;

      default:
        message.channel.send(
          "Ingrese que opción de loop quiere: loop all/one/off. "
        );
    }
  }
  function queueCmd(serverQueue) {
    if (!serverQueue.connection) {
      return message.channel.send(
        "No se esta reproduciendo nada en estos momentos..."
      );
    }
    if (!message.member.voice.channel) {
      return message.channel.send("Tenes que estar conectado a un canal!");
    }

    let nowPlaying = serverQueue.songs[0];
    let qMsg = `Se está reproduciendo: ${nowPlaying.title}\n------------------------------\n`;

    for (var i = 1; i < serverQueue.songs.length; i++) {
      qMsg += `${i}. ${serverQueue.songs[i].title}\n`;
    }

    message.channel.send("```" + qMsg + "```");
  }

  if (!message.content.startsWith(prefix)) {
    //el ! devuelve un boolean
    return;
  }

  if (cmd) {
    cmd.run(bot, message, args); //checkea si existe el comando y lo corre
  }

  if (sender.id === botID) {
    return;
  }

  if (!userData[sender.id])
    userData[sender.id] = {
      messageSent: 0,
    };

  userData[sender.id].messageSent++;
  //escribe en el json
  fs.writeFile("storage/userData.json", JSON.stringify(userData), (err) => {
    if (err) console.error(err);
  });

  if (msg === prefix + "reload") {
    if (message.channel.type === "dm") {
      message.channel.send("Commands reloaded...");
      loadCommands();
    } else {
      setTimeout(() => message.delete(), 5000);
      message.channel.send("Commands reloaded...").then((msg) => {
        msg.delete({ timeout: 5000 });
        loadCommands();
      });
    }
  }

  //Comando que borra mensajes
  if (message.channel.id === "847598285962477658") {
    if ("no me gusta el 43" === msg) {
      message.delete();
      message.author.send("Te deseo un mal dia!"); //Envia al usuario por MD
    }
  }

  if (msg.includes("verduras")) {
    message.delete();
    message.author.send("Me das asco, ojala te atragantes!");
  }
});

//Adicion de autorol cuando usuario entra al servidor
bot.on("guildMemberAdd", (guildMember) => {
  var autoRol = guildMember.guild.roles.cache.find(
    (role) => role.name === "AutoRol"
  );
  guildMember.roles.add(autoRol);
});

bot.on("guildMemberAdd", (newMember) => {
  //var username = newMember.user.username;
  var usernameID = `${newMember}`;
  const welcomeChannel = newMember.guild.channels.cache.find(
    (channel) => channel.name === "canaldeprueba"
  );
  welcomeChannel.send("Bienvenido " + usernameID + " te invito a pasarla mal!");
});

bot.on("guildMemberRemove", (newMember) => {
  //var username = newMember.user.username;
  var usernameID = `${newMember}`;
  const welcomeChannel = newMember.guild.channels.cache.find(
    (channel) => channel.name === "canaldeprueba"
  );
  welcomeChannel.send(usernameID + " no se bancó la gira.");
});

bot.login("");
