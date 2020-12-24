import { Message } from 'discord.js';
import {
  CommandArguments,
  CommandHandlerArgs,
  ParsedArgument,
  ParsedCommand
} from '../parser/types';
import { Collection, keysOf } from '../util';
import { Validator } from 'jsonschema';
import fs from 'fs';
import path from 'path';
import { parsedCommand } from '../schema';
import { InvalidInputError } from '../errors';

const validator = new Validator();
function validateCommand(cmd: ParsedCommand) {
  return validator.validate(cmd, parsedCommand);
}

const commands: Collection<ParsedCommand> = {};
function loadCommand(path: string): ParsedCommand | undefined {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cmd = require(path).default as ParsedCommand;
  const validation = validateCommand(cmd);
  if (!validation.valid) {
    console.warn('Validation error on', path);
    console.warn(validation.errors);
    console.warn(cmd);
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

function parseInput(input: string): string[] | null {
  return input.match(/\w+|"(?:\\"|[^"])+"/g) as string[];
}

function parseNextArg(input: string[], arg: ParsedArgument) {
  const val = input.shift();
  if (val === undefined) {
    if (arg.required)
      throw new InvalidInputError(`Parameter '${arg.name}' is **required**`);
    if (arg.array) return [];
    return undefined;
  }
  if (arg.array) {
    const arr = [val];
    // With input.length we can be sure that input.shift() will return something
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    while (input.length) arr.push(input.shift()!);
    if (arg.type === 'number') {
      const numArr = arr.map((i) => +i);
      if (numArr.includes(NaN))
        throw new InvalidInputError(`Parameter '${arg.name}' must a **number** array`);
      return numArr;
    }
    return arr;
  } else {
    if (arg.type === 'number') {
      if (isNaN(+val))
        throw new InvalidInputError(`Parameter '${arg.name}' must a **number** array`);
      return +val;
    }
    return val;
  }
}

export function runCommand(input: string, msg: Message) {
  const inputArgs = parseInput(input) || [input];
  const cmdName = inputArgs.shift();
  if (!cmdName) return;
  const cmd = commands[cmdName];
  if (!cmd) return;
  const args: CommandHandlerArgs<CommandArguments> = {};
  for (const arg of cmd.arguments) {
    const result = parseNextArg(inputArgs, arg);
    args[arg.name] = result;
  }
  cmd.handler(args, msg);
}

function getUsageOfArgument(arg: ParsedArgument) {
  const name = `${arg.name}: ${arg.type}${arg.array ? '[]' : ''}`;
  return arg.required ? `<${name}>` : `[${name}]`;
}
export function getCommandsHelp() {
  const result: Record<'name'|'description'|'usage', string>[] = [];
  for (const cmdName of keysOf(commands)) {
    const cmd = commands[cmdName];
    result.push({
      name: cmdName,
      usage: cmd.arguments.map(getUsageOfArgument).join(' '),
      description: cmd.description
    })
  }
  return result;
}
