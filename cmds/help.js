const discord = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["commands", "cmds"]
}

  module.exports.run = async (client, message, args) => {
    
    let embed = new discord.MessageEmbed()
    .setTitle(`Help Menu`)
    .setDescription("<a:a_giveaway:953697672823468042> - `help`\n<a:a_setting:953157853026340914> - [Source Code](https://discord.gg/MCYVYNXKXj)\n\n<a:a_r_arrow:953178325944270888> - `start`\n<a:a_r_arrow:953178325944270888> - `reroll`\n<a:a_r_arrow:953178325944270888> - `end`")
    .setColor("ORANGE")
   
    
    message.channel.send(embed)
    
  }