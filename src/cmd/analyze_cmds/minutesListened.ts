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
    describe: "Path to SQLite3 db file",
    type: "string",
    default: "./spotify-review.db",
  });
};

export async function handler(argv: Arguments<CommandArgs>) {
  try {
    console.log(
      "Note about minutes listened: https://github.com/jayden-chan/spotify-review#Notes"
    );
    const queries = new Queries(argv.db);
    console.table(await queries.minutesListened());
  } catch (err) {
    handleQueryError(err);
  }
}
