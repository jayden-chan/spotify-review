import { Arguments, BuilderCallback } from "yargs";
import { MS_TO_HR, MS_TO_MIN } from "../../constants";
import PromiseDB from "../../db";

export const command = "topArtists [db]";
export const desc = "Show the top artists";
export const aliases = [];

type CommandArgs = {
  limit: number;
  db: string;
  sort: string;
  year?: number;
};

export const builder: BuilderCallback<CommandArgs, any> = (yargs) => {
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
  const db = new PromiseDB(argv.db);

  if (!["plays", "time"].includes(argv.sort)) {
    console.error(
      'Error: "sort" option must be one of either "plays" or "time"'
    );
    return;
  }

  const sortCol = argv.sort === "plays" ? "plays" : "minutes";
  const query = `
  SELECT
    artist,
    COUNT(ms_played) AS plays,
    ROUND(CAST(SUM(ms_played) AS REAL) / ${MS_TO_MIN}, 0) AS minutes,
    ROUND(CAST(SUM(ms_played) AS REAL) / ${MS_TO_HR}, 2) AS hours
  FROM
    endsong
  WHERE
    track_name IS NOT NULL${
      argv.year ? ` AND strftime('%Y', ts) = '${argv.year}'` : ""
    }
  GROUP BY
    artist
  ORDER BY
    ${sortCol} DESC
  LIMIT ${argv.limit}
  `;

  try {
    const rows = await db.all(query);
    console.table(rows);
    await db.close();
  } catch (err) {
    console.error("Failed to execute query:");
    console.error(err);
  }
}
