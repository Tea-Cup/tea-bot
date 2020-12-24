import { APIMessageContentResolvable, DMChannel, NewsChannel, TextChannel } from 'discord.js';

export function sendTemporaryMessage(
  channel: TextChannel | DMChannel | NewsChannel,
  delay: number,
  content: APIMessageContentResolvable
) {
  channel.send(content).then((msg) => setTimeout(() => msg.delete(), delay));
}
