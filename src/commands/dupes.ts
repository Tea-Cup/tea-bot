import { createCommand } from '../parser';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import throttle from 'promise-throttle';
import { createProgress, updateProgress } from '../progress';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dhash = require('dhash-image');

const extensions = 'jpg,png,jpeg'.split(',');

function pipePromise(output: NodeJS.ReadableStream, input: NodeJS.WritableStream) {
  return new Promise<void>((resolve, reject) => {
    output.on('end', () => resolve());
    output.on('error', (err) => reject(err));
    output.pipe(input, { end: true });
  });
}
function unlinkPromise(path: fs.PathLike) {
  return new Promise<void>((resolve) => {
    fs.unlink(path, () => resolve());
  });
}
async function downloadUrl(path: string, url: string) {
  const response = await fetch(url);
  console.log(response);
  await pipePromise(response.body, fs.createWriteStream(path));
  console.log(path);
  return path;
}
function bufferToNumber(buffer: Buffer) {
  return buffer.reduceRight((p, c, i) => p + c * Math.pow(10, i));
}

export default createCommand({
  name: 'dupes',
  description: 'find duplicate images in the channel',
  handler: async (args, msg) => {
    const fetched = await msg.channel.messages.fetch();
    const iterator = fetched.values();
    let item = iterator.next();
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), msg.id));
    const toDownload: Record<'url' | 'path', string>[] = [];

    while (!item.done) {
      const value = item.value;
      const imgs = value.attachments
        .filter(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (a) => a && extensions.includes(a.name!.toLowerCase().split('.').pop()!)
        )
        .array();
      for (const img of imgs) {
        const extension = path.extname(img.url);
        toDownload.push({
          path: path.join(folder, `${img.id}${extension}`),
          url: img.url
        });
      }
      item = iterator.next();
    }

    let count = 0;
    const progress = await createProgress(
      msg.channel,
      'Downloading images...',
      toDownload.length,
      0
    );
    const interval = setInterval(() => {
      updateProgress(progress, { value: count });
    }, 1000);

    const images: string[] = [];
    const rateLimit = new throttle({
      requestsPerSecond: 1,
      promiseImplementation: Promise
    });
    for (const tdl of toDownload) {
      images.push(await rateLimit.add(downloadUrl.bind(null, tdl.path, tdl.url)));
      count++;
    }

    count = 0;

    await updateProgress(progress, {
      text: 'Processing images...',
      value: 0,
      max: images.length
    });

    for (const original of images) {
      const hash = bufferToNumber(await dhash(original));
      count++;
    }

    // TODO actual hash comparisons.
    // Subtraction? 8-dimensional vector distance?

    clearInterval(interval);
    await progress.msg.delete();

    await Promise.all(images.map((img) => unlinkPromise(img)));
    await unlinkPromise(folder);

    console.log('done');
  }
});
