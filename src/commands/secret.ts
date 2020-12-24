import { MessageEmbed } from 'discord.js';
import { getCommandsHelp } from '.';
import { createCommand } from '../parser';
import { getSetting } from '../settings';

export default createCommand({
  name: 'secret',
  description: 'list of commands and their usage including secret ones',
  secret: true,
  handler: (args, msg) => {
    const prefix = getSetting(msg.guild?.id, 'prefix');
    const help = getCommandsHelp(true);
    const embed = new MessageEmbed();
    for (const cmd of help){
      embed.addField(`${prefix}${cmd.name} ${cmd.usage}`, cmd.description);
    }
    msg.reply(embed);
  }
});
