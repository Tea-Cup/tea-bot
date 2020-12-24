import { Message } from 'discord.js';

export type ArgumentType<T> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'string?'
  ? string | undefined
  : T extends 'number?'
  ? number | undefined
  : T extends 'string[]'
  ? string[]
  : T extends 'number[]'
  ? number[]
  : never;

export type SimpleArgumentTypeName = 'string' | 'number';
export type ArgumentTypeName =
  | SimpleArgumentTypeName
  | `${SimpleArgumentTypeName}?`
  | `${SimpleArgumentTypeName}[]`;

export type CommandArguments = { [k: string]: ArgumentTypeName };
export type CommandHandlerArgs<T> = { [k in keyof T]: ArgumentType<T[k]> };

export type CommandHandler<T> = (args: CommandHandlerArgs<T>, msg: Message) => void;

export type Command<T extends CommandArguments> = {
  name: string;
  description: string;
  secret?: boolean;
  arguments: T;
  format: string;
  handler: CommandHandler<T>;
};

export type SimpleCommand = {
  name: string;
  description: string;
  secret?: boolean;
  handler: CommandHandler<unknown>;
};

export type ParsedArgument = {
  name: string;
  type: SimpleArgumentTypeName;
  array: boolean;
  required: boolean;
};

export type ParsedCommand = {
  name: string;
  description: string;
  secret: boolean;
  arguments: ParsedArgument[];
  handler: CommandHandler<CommandArguments>;
};
