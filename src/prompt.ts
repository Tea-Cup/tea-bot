import {
  APIMessageContentResolvable,
  DMChannel,
  NewsChannel,
  TextChannel
} from 'discord.js';

const yes = '791795408354934794';
const no = '791795417636798485';

export default async function prompt(
  channel: TextChannel | DMChannel | NewsChannel,
  content: APIMessageContentResolvable
) {
  const msg = await channel.send(content);
  await msg.react(no);
  await msg.react(yes);
  let result: boolean | undefined = undefined;
  do {
    const collected = await msg.awaitReactions((r) => [yes, no].includes(r.emoji.id), {
      max: 1
    });
    const answer = collected.first();
    if (!answer) throw new Error('collected reactions are empty');
    if (answer.emoji.id === yes) result = true;
    if (answer.emoji.id === no) result = false;
  } while (result === undefined);
  await msg.delete();
  return result;
}
