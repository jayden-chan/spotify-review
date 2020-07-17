import { Arguments, BuilderCallback } from "yargs";
import { MS_TO_MIN } from "../../constants";
import PromiseDB from "../../db";

export const command = "platforms [db]";
export const desc = "Show top platforms";
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
  const db = new PromiseDB(argv.db);

  const query = `
  SELECT
    platform,
    SUM(ms_played) / ${MS_TO_MIN} AS minutes_listened
  FROM
    endsong
  WHERE
    track_name IS NOT NULL
    AND reason_end = 'trackdone'
  GROUP BY
    platform
  ORDER BY
    minutes_listened DESC
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
