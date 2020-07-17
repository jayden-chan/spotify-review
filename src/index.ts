import yargs = require("yargs");
import { version } from "../package.json";

const USAGE_MSG = `spotify-review v${version}

Usage: spotify-review <cmd> [args...]`;

const options = {
  v: {
    alias: "version",
    global: false,
    type: "boolean",
    describe: "Show current version",
    skipValidation: true,
  },
} as const;

yargs
  .usage(USAGE_MSG)
  .commandDir("cmd")
  .scriptName("spotify-review")
  .recommendCommands()
  .options(options)
  .version(false)
  .help("help")
  .alias("help", "h")
  .showHelpOnFail(true)
  // @ts-ignore -- typedef is incorrect here
  .parse(process.argv.slice(2), (_, argv, output) => {
    if (argv.version === true && !argv._.length) {
      console.log(version);
    } else if (output) {
      console.log(output);
    }
  });
