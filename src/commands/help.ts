import { createCommand } from '../parser';

export default createCommand({
  name: 'help',
  arguments: {
    string: 'string',
    number: 'number',
    stringarr: 'string[]'
  },
  format: 'string number stringarr',
  handler: (args, msg) => {
    msg.reply('```json\n' + JSON.stringify(args, undefined, 2) + '\n```');
  }
});
