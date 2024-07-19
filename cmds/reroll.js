const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');

module.exports = {
  name: "reroll"
};

module.exports.run = async (client, message, args) => {
  let error = new MessageEmbed().setColor('RED').setTimestamp();
  if(!message.member.permissions.has('MANAGE_GUILD')) {
      return message.channel.send(error.setDescription('**<:Cross:953158094022668338> Missing Permission**'));
  };
  let gwId = args[0];
  if(!gwId) return message.channel.send(error.setDescription('**<:Cross:953158094022668338> Invalid Giveaway ID**'));
  let End = client.db.fetch(`gwReroll_${message.guild.id}`);
  let Id = client.db.fetch(`gwEnd_${message.guild.id}`);
  if(!Id) return message.channel.send(error.setDescription('**<:Cross:953158094022668338> Invalid Giveaway**'));
  if(!End) {
    return message.channel.send(error.setDescription('**<:Cross:953158094022668338> The Giveaway You Specified Haven\'t Finished Yet**'))
  } else {
    if(Id.key == gwId) {
      let channel = Id.channel;
      let key = client.db.fetch(`gwUsers_${message.guild.id}`);
      if(!key) {
        let gwEndedEmbed2 = new MessageEmbed()
        .setDescription(`<a:a_Gift:953697567244427295> Prize: **${Id.prize}**\n<a:a_Gift:953697567244427295> Winner(s): **No winners!**`)
        .setColor('BLURPLE')
        .setTimestamp()
        .setFooter('Rerolled at');
        return message.guild.channels.cache.get(channel).messages.cache.get(gwId).edit({ embed: gwEndedEmbed2 }).then(() => {
          client.channels.cache.get(channel).send(`Not Enough Entrants To Determine A Winner!`)
        });
      } else {
        let winners = client.db.get(`gwUsers_${message.guild.id}`)[Math.floor(Math.random()*client.db.get(`gwUsers_${message.guild.id}`).length)];
        let gwEndedEmbed = new MessageEmbed()
        .setDescription(`<a:a_Gift:953697567244427295> Prize: **${Id.prize}**\n<:logo:953698811375677450> Winner(s): <@${winners}>`)
        .setColor('BLURPLE')
        .setTimestamp()
        .setFooter('Rerolled at');
        return message.guild.channels.cache.get(channel).messages.cache.get(gwId).edit({ embed: gwEndedEmbed }).then(() => {
          return client.channels.cache.get(channel).send(`<a:a_Gift:953697567244427295> The New Winner Is <@${winners}>, Congratulations!`)
        });
      }
    } else {
      let embed2 = new MessageEmbed()
      .setDescription('**<:Cross:953158094022668338> Invalid Giveaway ID**')
      .setColor('BLURPLE')
      .setTimestamp()
      .setFooter('Failed at');
      return message.channel.send(embed2);
    }
  };
};