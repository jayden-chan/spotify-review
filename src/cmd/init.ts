import { Arguments, BuilderCallback } from "yargs";
import * as sqlite3 from "sqlite3";
import * as fs from "fs";
import * as readline from "readline";
import { schema } from "../schema";

export const command = "init <data>";
export const desc = "Initialize the SQLite3 database";
export const aliases = [];

type CommandArgs = {
  dbFile: string;
  data: string;
};

export const builder: BuilderCallback<CommandArgs, any> = (yargs) => {
  yargs
    .positional("data", {
      describe: "Path to EndSong.json",
      type: "string",
    })
    .option("dbFile", {
      type: "string",
      describe: "Path to the SQLite3 database file",
      default: "./spotify-review.db",
    });
};

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
  const db = new sqlite3.Database(argv.dbFile);

  console.log("Initializing database...");
  db.run(prepareCreateStatement());

  console.log("Reading EndSong.json...");
  const rl = readline.createInterface({
    input: fs.createReadStream(argv.data),
  });

  const prelude = `INSERT INTO endsong(${Object.entries(schema)
    .map(([key, meta]) => meta.sqlname ?? key)
    .join(",")}) VALUES\n`;

  const rows = [];

  for await (const line of rl) {
    const json = JSON.parse(line);
    const row = Object.entries(schema)
      .map(([key, meta]) => {
        const val = json[key];
        if (val !== undefined) {
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

    rows.push(`(${row})`);
  }

  console.log(`Inserting ${rows.length} rows...`);
  db.run(`${prelude}${rows.join(",\n")};`);
  db.close();
  console.log("Finished.");
}
