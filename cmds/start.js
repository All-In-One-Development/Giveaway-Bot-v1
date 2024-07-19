const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons');
const moment = require('moment');
const ms = require('ms');

module.exports = {
  name: "start",
}

module.exports.run = async (client, message, args) => {
  let error = new MessageEmbed().setColor('RED').setTimestamp();
  if(!message.member.permissions.has('MANAGE_GUILD')) {
      return message.channel.send(error.setDescription('**<:Cross:953158094022668338> Missing Permission**'));
  };
  let time = args[0];
  let winnersCount = args[1];
  let prize = args.slice(2).join(" ");
  if(!time) return message.channel.send(error.setDescription('**<:Cross:953158094022668338> Specify A Time!**'));
  if(!winnersCount) return message.channel.send(error.setDescription('**<:Cross:953158094022668338> Specify The Number Of Winner Count**'));
  if(!prize) return message.channel.send(error.setDescription('**<:Cross:953158094022668338> Specify A Prize!**'));
  let gwTime = ms(time);
  let gwEmbed = new MessageEmbed()
  .setDescription(`<a:a_Gift:953697567244427295> Prize: **${prize}**\n<a:a_giveaway:953697672823468042> Winner Count: **${winnersCount}**\n<a:a_timer:954249100084265060> Time: **${time}**`)
  .setColor('BLURPLE')
  .setTimestamp()
  .setFooter('Started at');
  let embedButton = new MessageButton()
  .setStyle('blurple')
  .setLabel('')
  .setEmoji('953697672823468042')
  .setID('gwButton');
  let msg = await message.channel.send({ buttons: [embedButton], embed: gwEmbed }).then(me => {
    let channelId = message.channel.id;
    let msgId = me.id;
    client.db.set(`gwEnd_${message.guild.id}`, { key: msgId, prize: prize, channel: channelId });
    async function edit() {
      let winners = client.db.get(`gwUsers_${message.guild.id}`)[Math.floor(Math.random()*client.db.get(`gwUsers_${message.guild.id}`).length)];
		
      let gwEndedEmbed = new MessageEmbed()
      .setDescription(`<a:a_Gift:953697567244427295> Prize: **${prize}**\n<a:a_giveaway:953697672823468042> Winner(s): <@${winners}>`)
      .setColor('BLURPLE')
      .setTimestamp()
      .setFooter('Ended at');
      me.edit({ embed: gwEndedEmbed }).then(() => {
        client.db.delete(`gwEntry_${message.guild.id}`),
        client.channels.cache.get(channelId).send(`Congratulations <@${winners}>, You Won <a:a_Gift:953697567244427295> **${prize}**! <a:a_Gift:953697567244427295>`)
      })
    }
    async function lockGw() {
      let gwEndedEmbed1 = new MessageEmbed()
      .setDescription(`<a:a_Gift:953697567244427295> Prize: **${prize}**\n<a:a_giveaway:953697672823468042> Winner(s): **No winners!**`)
      .setColor('BLURPLE')
      .setTimestamp()
      .setFooter('Ended at');
      me.edit({ embed: gwEndedEmbed1 }).then(() => {
        client.db.delete(`gwEntry_${message.guild.id}`),
        client.channels.cache.get(channelId).send(`Not Enough Entrants To Determine A Winner!`)
      })
    }
    message.delete();
    let filter = m => m.clicker.user.id !== client.user.id;
    let cl = me.createButtonCollector(filter);
    cl.on('collect', async (button) => {
      button.defer()
      if (button.id == "gwButton") {
        let userId = button.clicker.user.id;
        client.users.cache.get(userId).send('<a:a_giveaway:953697672823468042> Your Entry Has Been Approved For **'+prize+'**')
        client.db.push(`gwUsers_${message.guild.id}`, userId)
      };
    });
    setTimeout(function() {
      let g = client.db.fetch(`gwUsers_${message.guild.id}`);
      if(!g) {
        lockGw()
        client.db.set(`gwReroll_${message.guild.id}`, { Set: 2 });
      } else {
        edit()
        client.db.set(`gwReroll_${message.guild.id}`, { Set: 1 });
      };
    }, gwTime);
  });
}