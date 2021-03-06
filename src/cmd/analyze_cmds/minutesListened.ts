import { Arguments, BuilderCallback } from "yargs";
import Queries from "../../queries";
import { handleQueryError } from "../../util";

export const command = "minutesListened [db]";
export const desc = "Show minutes listened per year";
export const aliases = [];

type CommandArgs = {
  db: string;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs.positional("db", {
    type: "string",
    describe: "Path to SQLite3 db file",
    default: "./spotify-review.db",
  });
};

export async function handler(argv: Arguments<CommandArgs>) {
  try {
    console.log(
      "\nNote about minutes listened: https://github.com/jayden-chan/spotify-review#Notes\n"
    );
    const queries = new Queries(argv.db);
    console.table(await queries.minutesListened());
  } catch (err) {
    handleQueryError(err);
  }
}
