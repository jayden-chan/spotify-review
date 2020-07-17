import { Arguments, BuilderCallback } from "yargs";
import { MS_TO_HR, MS_TO_MIN } from "../../constants";
import PromiseDB from "../../db";

export const command = "topSongs <db>";
export const desc = "Show the top songs";
export const aliases = [];

type CommandArgs = {
  limit: number;
  db: string;
  year?: number;
};

export const builder: BuilderCallback<CommandArgs, any> = (yargs) => {
  yargs
    .positional("db", {
      describe: "Path to SQLite3 db file",
      type: "string",
    })
    .option("limit", {
      type: "number",
      describe: "Number of results to return",
      default: 25,
    })
    .option("year", {
      type: "number",
      describe: "Return top songs for the provided year only",
    });
};

export async function handler(argv: Arguments<CommandArgs>) {
  const db = new PromiseDB(argv.db);

  const query = `
  SELECT
    track_name AS title,
    artist,
    COUNT(ms_played) AS plays,
    ROUND(SUM(ms_played) / ${MS_TO_MIN}, 0) AS mins_played,
    ROUND(CAST(SUM(ms_played) AS REAL) / ${MS_TO_HR}, 2) AS hours_played
  FROM
    endsong
  WHERE
    track_name IS NOT NULL${
      argv.year ? ` AND strftime('%Y', ts) = '${argv.year}'` : ""
    }
  GROUP BY
    title,
    artist
  ORDER BY
    plays DESC
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
