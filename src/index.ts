import { Client } from 'discord.js';
import token from './token.json';
import { registerCommands, runCommand } from './commands';
import { getSetting } from './settings';
import './extensions';

registerCommands();

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('message', (msg) => {
  const prefix = getSetting(msg.guild?.id, 'prefix');
  if (!msg.content.startsWith(prefix)) return;
  const input = msg.content.substr(prefix.length);
  console.log(msg.author.tag, ':', msg.content);
  try {
    runCommand(input, msg);
  } catch (err) {
    console.error(err);
    msg.reply(err.message);
  }
});

client.login(token);
