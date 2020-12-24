export class CommandValidationError extends Error {
  private cmd: string;
  get command() {
    return this.cmd;
  }
  constructor(message: string, command: string) {
    super(`[${command}] ${message}`);
    this.cmd = command;
    this.name = 'CommandValidationError';
  }
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
  }
}