import { Collection, keysOf } from '../util';
import { CommandValidationError } from '../errors';
import {
  Command,
  CommandArguments,
  ParsedArgument,
  ParsedCommand,
  SimpleArgumentTypeName,
  SimpleCommand
} from './types';

function isArgs(
  cmd: Command<CommandArguments> | SimpleCommand
): cmd is Command<CommandArguments> {
  const command = cmd as Command<CommandArguments>;
  return !!command.arguments || !!command.format;
}

function validateName(name: string) {
  return /^[a-z][a-z0-9]*$/.test(name);
}
function validateArgType(type: string) {
  return /^(string|number)(\?|\[\])?$/.test(type);
}

function parseArgs(cmd: Command<CommandArguments>): ParsedCommand {
  if (!cmd.arguments) throw new CommandValidationError('No arguments', cmd.name);
  if (!cmd.format) throw new CommandValidationError('No format', cmd.name);

  const split = cmd.format.split(' ');
  const argNames = keysOf(cmd.arguments);
  const parsed: Collection<ParsedArgument | undefined> = {};
  const checked: Set<string> = new Set();
  const ordered: ParsedArgument[] = [];

  for (const name of argNames) {
    if (!validateName(name))
      throw new CommandValidationError(`Invalid argument name "${name}"`, cmd.name);
    const argType = cmd.arguments[name];
    if (!validateArgType(argType))
      throw new CommandValidationError(`Invalid argument type "${argType}"`, cmd.name);
    const match = /^(string|number)(\?|\[\])?/.exec(argType);
    if (!match)
      throw new CommandValidationError(`Invalid argument type "${argType}"`, cmd.name);
    const type = match[1] as SimpleArgumentTypeName;
    const array = match[2] === '[]';
    const required = match[2] !== '?';
    parsed[name] = { name, type, array, required };
  }

  for (const name of split) {
    const arg = parsed[name];
    if (!arg)
      throw new CommandValidationError(`Unknown argument name "${name}"`, cmd.name);
    if (checked.has(name))
      throw new CommandValidationError(
        `Duplicate argument in format "${name}"`,
        cmd.name
      );
    checked.add(name);
    ordered.push(arg);
    delete parsed[name];
  }

  const leftover = keysOf(parsed);
  if (leftover.length)
    throw new CommandValidationError(
      'Arguments not specified in format ' +
        leftover.map((name) => `"${name}"`).join(','),
      cmd.name
    );

  return {
    name: cmd.name,
    arguments: ordered,
    handler: cmd.handler
  };
}
function parseSimple(cmd: SimpleCommand): ParsedCommand {
  return {
    name: cmd.name,
    arguments: [],
    handler: cmd.handler
  };
}

export function createCommand<T extends CommandArguments>(cmd: Command<T>): ParsedCommand;
export function createCommand(cmd: SimpleCommand): ParsedCommand;
export function createCommand(
  cmd: Command<CommandArguments> | SimpleCommand
): ParsedCommand {
  if (validateName(cmd.name))
    throw new CommandValidationError('Invalid command name', cmd.name);
  if (!cmd.handler) throw new CommandValidationError('No handler on command', cmd.name);

  if (isArgs(cmd)) return parseArgs(cmd);
  else return parseSimple(cmd);
}
