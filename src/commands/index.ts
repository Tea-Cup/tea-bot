import { Message } from 'discord.js';
import { ParsedCommand } from '../parser/types';
import { Collection } from '../util';
import { Validator } from 'jsonschema';
import fs from 'fs';
import path from 'path';
import { parsedCommand } from '../schema';

const validator = new Validator();
function validateCommand(cmd: ParsedCommand) {
  return validator.validate(cmd, parsedCommand);
}

const commands: Collection<ParsedCommand> = {};
function loadCommand(path: string): ParsedCommand | undefined {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cmd = require(path) as ParsedCommand;
  const validation = validateCommand(cmd);
  if(!validation.valid) {
    console.warn('Validation error on', path);
    return undefined;
  }
  return cmd;
}
function registerCommand(cmd: ParsedCommand) {
  commands[cmd.name] = cmd;
}

export function registerCommands() {
  const files = fs.readdirSync(__dirname);
  for (const file of files) {
    if (file === 'index.js') continue;
    const fullPath = path.join(__dirname, file);
    const cmd = loadCommand(fullPath);
    if (cmd) registerCommand(cmd);
    else console.warn('Not a valid command on path', fullPath);
  }
}

export function runCommand(input: string, msg: Message) {
  throw new Error('TODO: Not implemented');
}
