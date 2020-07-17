import { Arguments, BuilderCallback } from "yargs";
import { MONTH_NAMES } from "../../constants";
import PromiseDB from "../../db";

export const command = "monthlyTopArtists <year> [db]";
export const desc = "Show the top artists of each month for the given year";
export const aliases = [];

type CommandArgs = {
  year: number;
  db: string;
  limit: number;
};

export const builder: BuilderCallback<CommandArgs, any> = (yargs) => {
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
  let db;
  try {
    db = new PromiseDB(argv.db, true);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    return;
  }

  const n = argv.limit;

  const query = `WITH artists_per_month AS (
    SELECT
      artist,
      CAST(strftime('%m', ts) AS INT) AS month,
      SUM(ms_played) AS total_ms
    FROM
      endsong
    WHERE
      strftime('%Y', ts) = '${argv.year}'
      AND artist IS NOT NULL
    GROUP BY
      artist,
      month
  ), ranks AS (
    SELECT
      artist,
      month,
      RANK() OVER (PARTITION BY month ORDER BY total_ms DESC) AS rank
    FROM
      artists_per_month
  )
  SELECT
    GROUP_CONCAT(artist, ', ') AS top_${n}_artists,
    month
  FROM
    ranks
  WHERE
    rank <= ${n}
  GROUP BY
    month
  ORDER BY
    month
  `;

  try {
    const rows = await db.all(query);
    console.table(
      rows.map((row) => {
        row.month = MONTH_NAMES[row.month - 1];
        return row;
      })
    );
    await db.close();
  } catch (err) {
    console.error("Failed to execute query:");
    console.error(err);
  }
}
