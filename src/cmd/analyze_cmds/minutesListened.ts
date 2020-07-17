import { Arguments, BuilderCallback } from "yargs";
import { MS_TO_MIN } from "../../constants";
import PromiseDB from "../../db";

export const command = "minutesListened [db]";
export const desc = "Show minutes listened per year";
export const aliases = [];

type CommandArgs = {
  db: string;
};

export const builder: BuilderCallback<CommandArgs, any> = (yargs) => {
  yargs.positional("db", {
    describe: "Path to SQLite3 db file",
    type: "string",
    default: "./spotify-review.db",
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

  const query = `
  SELECT
    strftime('%Y', ts) AS year,
    SUM(ms_played) / ${MS_TO_MIN} AS minutes_listened
  FROM
    endsong
  WHERE
    track_name IS NOT NULL
  GROUP BY
    year
  ORDER BY
    year DESC
  `;

  try {
    const rows = await db.all(query);
    console.table(rows);
    console.log(
      `Total Minutes: ${rows.reduce(
        (prev, curr) => prev + curr.minutes_listened,
        0
      )}`
    );
    await db.close();
  } catch (err) {
    console.error("Failed to execute query:");
    console.error(err);
  }
}
