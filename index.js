const { Client, Collection } = require('discord.js');
const chalk = require("chalk");
const data = require('croxydb');
const fs = require('fs')
const client = new Client();
client.commands = new Collection();
client.db = data;
require('discord-buttons')(client);


client.on('ready', () => {
  console.log(chalk.bold.blue(`Successfully Logged In As ${client.user.tag}\n\n`));

  client.user.setActivity(process.env.PREFIX + 'help', { type: "LISTENING" }).catch(console.error)
})

client.on('message', (message) => {
  let prefix = process.env.PREFIX;
  if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args);
});

fs.readdir('./cmds/', (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    let cmd = require(`./cmds/${f}`);
      client.commands.set(cmd.name, cmd);
  });
});

client.login(process.env.TOKEN);
const express = require('express');
const app = express();
const port = 3000 || 8080;

app.all('/', (req, res) => {
  // res.setHeader('Content-Type', 'text/html');
  res.send(`<a href="https://discord.gg/MCYVYNXKXj"><img src="https://media.discordapp.net/attachments/945572599528841226/952223857438236732/standard_1.gif"></a>`);
  res.end();
});
 app.listen(port, () => {
    console.log("24/7 KeepAlive Server is online!\n" + "\njoin now:- https://discord.gg/MCYVYNXKXj\n\n")
  });