import { Arguments, BuilderCallback } from "yargs";
import Queries from "../../queries";
import { handleQueryError } from "../../util";

export const command = "platforms [db]";
export const desc = "Show top platforms";
export const aliases = [];

type CommandArgs = {
  db: string;
  limit: number;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs
    .positional("db", {
      type: "string",
      describe: "Path to SQLite3 db file",
      default: "./spotify-review.db",
    })
    .option("limit", {
      type: "number",
      describe: "Number of results to return",
      default: 25,
    });
};

export async function handler(argv: Arguments<CommandArgs>) {
  try {
    const queries = new Queries(argv.db);
    console.table(await queries.platforms(argv.limit));
  } catch (err) {
    handleQueryError(err);
  }
}
