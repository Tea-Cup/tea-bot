import { Collection, Message } from 'discord.js';
import { createCommand } from '../parser';
import prompt from '../prompt';

// TODO DiscordAPIError: You can only bulk delete messages that are under 14 days old.

export default createCommand({
  name: 'clear',
  description: 'Clears the channel entirely',
  secret: true,
  handler: async (args, msg) => {
    if(msg.channel.type === 'dm') return msg.reply('This command is not allowed in DM');
    const ok = await prompt(
      msg.channel,
      'This action is irreversible. Are you sure you want to proceed?'
    );
    if(!ok) return msg.reply('Cancelled.');
    let fetched: Collection<string, Message>;
    let count = 0;
    do {
      fetched = await msg.channel.messages.fetch({limit: 100});
      count += fetched.size;
      msg.channel.bulkDelete(fetched);
    } while(fetched.size >= 2);
    msg.reply(`**${count}** messages have been deleted.`);
  }
});
