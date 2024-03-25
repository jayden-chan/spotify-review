import * as fs from "fs";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import * as readline from "readline";
import { Arguments, BuilderCallback } from "yargs";
import PromiseDB from "../db";
import { schema } from "../schema";

export const command = "init <data>";
export const desc = "Initialize the SQLite3 database";
export const aliases = [];

type CommandArgs = {
  data: string;
  dbFile: string;
  newFormat: boolean;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs
    .positional("data", {
      type: "string",
      describe: "Path to EndSong.json or folder with endsong_0 to endsong_N",
    })
    .option("dbFile", {
      type: "string",
      describe: "Path to the SQLite3 database file",
      default: "./spotify-review.db",
    })
    .option("newFormat", {
      type: "boolean",
      describe: "Use the new end_song format (endsong_0 to endsong_N)",
      default: false,
    });
};

function getRow(json: any) {
  const row = Object.entries(schema)
    .map(([key, meta]) => {
      const val = json[key];
      if (val !== undefined && val !== null) {
        if (key === "ts") {
          return `'${val.replace(" UTC", "Z")}'`;
        }

        switch (meta.type) {
          case "boolean":
          case "number":
            return val;
          case "string":
            return `'${val.replace(/'/g, "''")}'`;
        }
      } else {
        return "NULL";
      }
    })
    .join(", ");

  return row;
}

function prepareCreateStatement(): string {
  return `CREATE TABLE endsong (\n${Object.entries(schema)
    .map(([key, meta]) => {
      const actualKey = meta.sqlname ?? key;
      return `  ${actualKey} ${
        meta.sql ??
        (meta.type === "string"
          ? "TEXT"
          : meta.type === "number"
          ? "BIGINT"
          : "BOOLEAN")
      }`;
    })
    .join(",\n")}\n);`;
}

export async function handler(argv: Arguments<CommandArgs>) {
  if (fs.existsSync(argv.dbFile)) {
    console.error(`Error: Database file ${argv.dbFile} already exists.`);
    console.error(
      "If you want to re-initialize the database, please delete the old file."
    );
    return;
  }

  const db = new PromiseDB(argv.dbFile);

  console.log("Initializing database...");
  db.run(prepareCreateStatement());

  const rows = [];

  if (argv.newFormat) {
    const files = await readdir(argv.data);
    files.sort((a, b) => a.localeCompare(b));
    console.log(files);

    for (const file of files) {
      const path = join(argv.data, file);

      if (!path.endsWith(".json")) {
        continue;
      }

      console.log(`Reading ${path}`);
      const contents = await readFile(path, { encoding: "utf8" });
      const json = JSON.parse(contents);
      if (!Array.isArray(json)) {
        throw new Error(`ERROR: parsed JSON isn't an array (${path})`);
      }

      for (const line of json) {
        const row = getRow(line);
        rows.push(`(${row})`);
      }
    }
  } else {
    console.log("Reading EndSong.json...");
    const rl = readline.createInterface({
      input: fs.createReadStream(argv.data),
    });

    for await (const line of rl) {
      const json = JSON.parse(line);
      const row = getRow(json);
      rows.push(`(${row})`);
    }
  }

  console.log(`Inserting ${rows.length} rows...`);

  try {
    const prelude = `INSERT INTO endsong(${Object.entries(schema)
      .map(([key, meta]) => meta.sqlname ?? key)
      .join(",")}) VALUES\n`;

    await db.run(`${prelude}${rows.join(",\n")};`);
    await db.close();
    console.log("Finished.");
  } catch (err) {
    console.error("Failed to insert rows:");
    console.error(err);
  }
}
