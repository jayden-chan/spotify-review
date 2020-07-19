import { Arguments, BuilderCallback } from "yargs";
import Queries from "../../queries";
import { handleQueryError } from "../../util";

export const command = "topArtists [db]";
export const desc = "Show the top artists";
export const aliases = [];

type CommandArgs = {
  db: string;
  limit: number;
  sort: string;
  year?: number;
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
    })
    .option("sort", {
      type: "string",
      describe: 'Which column to sort on (either "plays" or "time")',
      default: "time",
    })
    .option("year", {
      type: "number",
      describe: "Return top songs for the provided year only",
    });
};

export async function handler(argv: Arguments<CommandArgs>) {
  if (!["plays", "time"].includes(argv.sort)) {
    console.error(
      'Error: "sort" option must be one of either "plays" or "time"'
    );
    return;
  }

  try {
    const queries = new Queries(argv.db);
    console.table(await queries.topArtists(argv.sort, argv.limit, argv.year));
  } catch (err) {
    handleQueryError(err);
  }
}
