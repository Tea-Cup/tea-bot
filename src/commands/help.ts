import { MessageEmbed } from 'discord.js';
import { getCommandsHelp } from '.';
import { createCommand } from '../parser';
import { getSetting } from '../settings';

export default createCommand({
  name: 'help',
  description: 'list of commands and their usage',
  handler: (args, msg) => {
    const prefix = getSetting(msg.guild?.id, 'prefix');
    const help = getCommandsHelp();
    const embed = new MessageEmbed();
    for (const cmd of help){
      embed.addField(`${prefix}${cmd.name} ${cmd.usage}`, cmd.description);
    }
    msg.reply(embed);
  }
});
