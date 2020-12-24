import { Message } from 'discord.js';
import { createCommand } from '../parser';
import { getFullSettings, getSetting, setSetting } from '../settings';
import { keysOf } from '../util';

function printFullSettings(msg: Message) {
  const settings = getFullSettings(msg.guild?.id);
  msg.reply(
    [
      '```',
      ...keysOf(settings).map((name) => `'${name}' = '${(settings as any)[name]}'`),
      '```'
    ].join('\n')
  );
}

export default createCommand({
  name: 'setting',
  description: 'manage internal settings for current guild',
  secret: true,
  arguments: {
    operation: 'string',
    name: 'string?',
    value: 'string?'
  },
  format: 'operation name value',
  handler: ({ operation, name, value }, msg) => {
    switch (operation) {
      case 'get':
        if (!name) return msg.reply("'name' is required for 'get'");
        msg.reply(`\`${name}\` = '${getSetting(msg.guild?.id, name as any)}'`);
        break;
      case 'set':
        if (!name) return msg.reply("'name' is required for 'set'");
        if (!msg.guild) return msg.reply("'set' operation only allowed in a guild");
        setSetting(msg.guild.id, name as any, value);
        msg.reply(`\`${name}\` = '${getSetting(msg.guild?.id, name as any)}'`);
        break;
      case 'list':
        printFullSettings(msg);
        break;
      default:
        msg.reply(
          `Invalid operation: '${operation}'.\nAllowed values: \`get\`, \`set\`, \`list\``
        );
        break;
    }
  }
});
