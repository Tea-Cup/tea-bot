import { createCommand } from '../parser';
import { sendTemporaryMessage } from '../temporaryMessage';

const cps = 300 / 60;

const cache: Set<string> = new Set();

export default createCommand({
  name: 'say',
  description: 'say something',
  arguments: {
    text: 'string[]'
  },
  format: 'text',
  handler: (args, msg) => {
    const text = args.text.join(' ');
    if (text.length === 0) return;
    if(cache.has(msg.channel.id)) {
      sendTemporaryMessage(msg.channel, 2000, "Hold on, I'm not done yet...");
      return;
    }
    cache.add(msg.channel.id); 
    let totalTime = text.length / cps;
    console.log('length:', text.length, 'time:', totalTime);
    msg.channel.startTyping();
    const interval = setInterval(() => {
      if (totalTime > 0) {
        console.log(totalTime);
        totalTime -= 0.5;
      } else {
        msg.channel.stopTyping(true);
        msg.channel.send(text);
        cache.delete(msg.channel.id);
        clearInterval(interval);
      }
    }, 500);
  }
});
