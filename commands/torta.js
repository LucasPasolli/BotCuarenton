const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  //async no espera a que se realice la instruccion anterior
  if (message.channel.type === "dm") {
    const ingredientesTorta = fs.readFileSync(
      "storage/torta/ingredientes.txt",
      "utf8"
    );
    const procesoTorta = fs.readFileSync("storage/torta/proceso.txt", "utf8");
    const embed = new Discord.MessageEmbed()
      .setTitle("__**Torta Cuarentona**__")
      .setDescription("Bueno, vamo a come")
      .setColor("e3a144")
      .addFields(
        { name: "__Vamos a necesitar:__", value: ingredientesTorta },
        { name: "__Segui estos pasos capo:__", value: procesoTorta }
      )
      .setThumbnail("https://jooinn.com/images/number-43-1.png")
      .setTimestamp()
      .setFooter(
        "Compartile a la gorda, no seas forro",
        "https://www.nicepng.com/png/full/433-4338735_cake-icon-cake-doodle-png.png"
      );
    message.author.send(embed);
  } else {
    setTimeout(() => message.delete(), 5000);
    message.channel.send("Ahi te lo mande al privado REY").then((msg) => {
      msg.delete({ timeout: 5000 });
    });
    const ingredientesTorta = fs.readFileSync(
      "storage/torta/ingredientes.txt",
      "utf8"
    );
    const procesoTorta = fs.readFileSync("storage/torta/proceso.txt", "utf8");
    const embed = new Discord.MessageEmbed()
      .setTitle("__**Torta Cuarentona**__")
      .setDescription("Bueno, vamo a come")
      .setColor("e3a144")
      .addFields(
        { name: "__Vamos a necesitar:__", value: ingredientesTorta },
        { name: "__Segui estos pasos capo:__", value: procesoTorta }
      )
      .setThumbnail("https://jooinn.com/images/number-43-1.png")
      .setTimestamp()
      .setFooter(
        "Compartile a la gorda, no seas forro",
        "https://www.nicepng.com/png/full/433-4338735_cake-icon-cake-doodle-png.png"
      );
    message.author.send(embed);
  }
};

module.exports.config = {
  command: "torta",
};
