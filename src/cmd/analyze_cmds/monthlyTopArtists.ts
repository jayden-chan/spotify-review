import { Arguments, BuilderCallback } from "yargs";
import Queries from "../../queries";
import { handleQueryError } from "../../util";

export const command = "monthlyTopArtists <year> [db]";
export const desc = "Show the top artists of each month for the given year";
export const aliases = [];

type CommandArgs = {
  year: number;
  db: string;
  limit: number;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs
    .positional("year", {
      describe: "The year to analyze",
      type: "number",
    })
    .positional("db", {
      describe: "Path to SQLite3 db file",
      type: "string",
      default: "./spotify-review.db",
    })
    .option("limit", {
      type: "number",
      describe: "Number of results to return",
      default: 3,
    });
};

export async function handler(argv: Arguments<CommandArgs>) {
  try {
    const queries = new Queries(argv.db);
    console.table(
      (await queries.monthlyTopArtists(argv.year, argv.limit)).map((row) => {
        // @ts-ignore -- Runtime type
        row[`top_${argv.limit}_artists`] = row.top_artists.join(", ");
        delete row.top_artists;
        return row;
      })
    );
  } catch (err) {
    handleQueryError(err);
  }
}
