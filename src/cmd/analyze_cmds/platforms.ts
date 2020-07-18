import { Arguments, BuilderCallback } from "yargs";
import Queries from "../../queries";
import { handleQueryError } from "../../util";

export const command = "platforms [db]";
export const desc = "Show top platforms";
export const aliases = [];

type CommandArgs = {
  db: string;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs.positional("db", {
    describe: "Path to SQLite3 db file",
    type: "string",
    default: "./spotify-review.db",
  });
};

export async function handler(argv: Arguments<CommandArgs>) {
  try {
    const queries = new Queries(argv.db);
    console.table(await queries.platforms());
  } catch (err) {
    handleQueryError(err);
  }
}
