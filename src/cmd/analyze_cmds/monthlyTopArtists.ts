import { Arguments, BuilderCallback } from "yargs";
import Queries from "../../queries";
import { handleQueryError, printData } from "../../util";

export const command = "monthlyTopArtists <year> [db]";
export const desc = "Show the top artists of each month for the given year";
export const aliases = [];

type CommandArgs = {
  year: number;
  db: string;
  limit: number;
  format: string;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs
    .positional("year", {
      type: "number",
      describe: "The year to analyze",
    })
    .positional("db", {
      type: "string",
      describe: "Path to SQLite3 db file",
      default: "./spotify-review.db",
    })
    .option("format", {
      type: "string",
      describe: "Output format. Either `table` or `csv`",
      default: "table",
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
    printData(
      (await queries.monthlyTopArtists(argv.year, argv.limit)).map((row) => {
        // @ts-ignore -- Runtime type
        row[`top_${argv.limit}_artists`] = row.top_artists.join(", ");
        delete row.top_artists;
        return row;
      }),
      argv.format
    );
  } catch (err) {
    handleQueryError(err);
  }
}
