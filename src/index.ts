import { Client } from 'discord.js';
import token from './token.json';
import { registerCommands } from './commands';
import './extensions';

registerCommands();

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.login(token);
