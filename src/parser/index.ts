import { keysOf } from '../util';
import { CommandValidationError } from './errors';
import {
  ArgumentTypeName,
  Command,
  CommandArguments,
  ParsedCommand,
  SimpleCommand
} from './types';

function isArgs(
  cmd: Command<CommandArguments> | SimpleCommand
): cmd is Command<CommandArguments> {
  const command = cmd as Command<CommandArguments>;
  return !!command.arguments || !!command.format;
}
function checkAllUnique(arr: string[]) {
  return new Set(arr).size == arr.length;
}

function validateName(name: string) {
  return /^[a-z][a-z0-9]*$/.test(name);
}
function validateArgType(type: string) {
  return /^(string|number)(\?|\[\])?$/.test(type);
}

function validateArgs(cmd: Command<CommandArguments>) {
  if (!cmd.arguments) throw new CommandValidationError('No arguments', cmd.name);
  if (!cmd.format) throw new CommandValidationError('No format', cmd.name);

  const split = cmd.format.split(' ');
  const argNames = keysOf(cmd.arguments);

  for (const name of argNames) {
    if (!validateName(name))
      throw new CommandValidationError(`Invalid argument name: "${name}"`, cmd.name);
    const type = cmd.arguments[name];
    if (!validateArgType(type))
      throw new CommandValidationError(
        `Invalid type of argument "${name}": "${type}"`,
        cmd.name
      );
    if (!split.includes(name))
      throw new CommandValidationError(
        `Argument not defined in format: "${name}"`,
        cmd.name
      );
  }

  const checked: string[] = [];
  const order: [string, ArgumentTypeName][] = [];
  for (const name of split) {
    if (!validateName(name))
      throw new CommandValidationError(
        `Invalid argument name in format: "${name}"`,
        cmd.name
      );
    if (checked.includes(name))
      throw new CommandValidationError(
        `Duplicate argument name in format: "${name}"`,
        cmd.name
      );
    if (!argNames.includes(name))
      throw new CommandValidationError(
        `Unknown argument name in format: "${name}"`,
        cmd.name
      );
    checked.push(name);
    order.push([name, cmd.arguments[name]]);
  }

  const hasArrays = !!order.find(([_, type]) => /\[\]$/.test(type));

  throw new Error('TODO: Not implemented');
}

function parseArgs(cmd: Command<CommandArguments>): ParsedCommand {
  throw new Error('TODO: Not implemented');
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
