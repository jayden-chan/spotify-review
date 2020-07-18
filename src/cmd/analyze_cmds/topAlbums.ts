import { Arguments, BuilderCallback } from "yargs";
import Queries from "../../queries";
import { handleQueryError } from "../../util";

export const command = "topAlbums [db]";
export const desc = "Show the top albums";
export const aliases = [];

type CommandArgs = {
  limit: number;
  db: string;
  sort: string;
  year?: number;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs
    .positional("db", {
      describe: "Path to SQLite3 db file",
      type: "string",
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
    console.table(await queries.topAlbums(argv.sort, argv.limit, argv.year));
  } catch (err) {
    handleQueryError(err);
  }
}
