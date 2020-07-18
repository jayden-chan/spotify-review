import { Arguments, BuilderCallback } from "yargs";

export const command = "analyze <command>";
export const desc = "Analyze the data";
export const aliases = [];

type CommandArgs = {};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  return yargs.commandDir("analyze_cmds");
};

export async function handler(_argv: Arguments<CommandArgs>) {}
