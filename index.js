import { ParseURL } from './lib/parse-url.js';

const argUrl = process.argv[2];

if (!argUrl) {
  console.log("Please provide url");
  process.exit(1);
}

function main() {
  try {
    const parsedUrl = new ParseURL(argUrl);
    parsedUrl.request();
  } catch(err) {
    console.error(err);
  }
}

main();
