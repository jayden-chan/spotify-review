import { Arguments, BuilderCallback } from "yargs";
import { generate as generateSVG, PalettePresets } from "svg-heatmap";
import { writeFile as writeFileCallback } from "fs";
import { promisify } from "util";
import Queries from "../../queries";
import { handleQueryError } from "../../util";

const writeFile = promisify(writeFileCallback);

export const command = "heatmap <path> [year] [db]";
export const desc = "Generate a listening heatmap for the given year";
export const aliases = [];

type CommandArgs = {
  path: string;
  year: number;
  db: string;
};

export const builder: BuilderCallback<CommandArgs, never> = (yargs) => {
  yargs
    .positional("path", {
      type: "string",
      describe: "Path of the output svg file",
    })
    .positional("year", {
      type: "number",
      describe: "The year to analyze",
      default: 2019,
    })
    .positional("db", {
      type: "string",
      describe: "Path to SQLite3 db file",
      default: "./spotify-review.db",
    });
};

export async function handler(argv: Arguments<CommandArgs>) {
  const palette = [
    "#eeeeee",
    "#e0f4f3",
    "#ccecee",
    "#b9dee7",
    "#a6cce1",
    "#93b6da",
    "#7f9dd4",
    "#6c80ce",
    "#595fc7",
    "#5061b2",
    "#46609e",
    "#3d5d89",
    "#345774",
    "#2b4d5f",
    "#21424b",
    "#183336",
  ];

  try {
    const queries = new Queries(argv.db);
    const data = await queries.heatmap(argv.year);
    const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${generateSVG(
      data.heatmap,
      argv.year,
      palette
    )}`;

    await writeFile(argv.path, svg, { encoding: "utf8" });
  } catch (err) {
    handleQueryError(err);
  }
}
