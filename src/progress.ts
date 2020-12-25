import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js';

const loading = '<a:loading:792164287131942922>';

function progressText(text: string, max?: number, value?: number) {
  if (max === undefined && value !== undefined) {
    return `${text}\n\n${value} / ${loading}`;
  } else if (max !== undefined && value === undefined) {
    return `${text}\n\n${loading} / ${max}`;
  } else if (max !== undefined && value !== undefined) {
    const maxLen = max.toString().length;
    const percent = ((value / max) * 100).toFixed(0).padStart(3, ' ');
    return `${text}\n\n${value.toString().padStart(maxLen, ' ')} / ${max} (${percent}%)`;
  } else {
    return text;
  }
}

interface Progress {
  msg: Message;
  text: string;
  max?: number;
  value?: number;
}

function coalesce<T>(a: T | undefined, b: T | undefined) {
  return a === undefined ? b : a;
}

export async function createProgress(
  channel: TextChannel | DMChannel | NewsChannel,
  text: string,
  max?: number,
  value?: number
): Promise<Progress> {
  return {
    msg: await channel.send(progressText(text, max, value)),
    text,
    max,
    value
  };
}
export function updateProgress(
  progress: Progress,
  options: { text?: string; max?: number; value?: number }
) {
  progress.text = coalesce(options.text, progress.text) || '';
  progress.max = coalesce(options.max, progress.max);
  progress.value = coalesce(options.value, progress.value);
  return progress.msg.edit(progressText(progress.text, progress.max, progress.value));
}
