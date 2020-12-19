import {Client} from 'discord.js';
import token from '../token.json';

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.login(token);