import { ParseURL } from './lib/parse-url.js';
import fetchRaw  from './lib/fetch-raw.js';

const url = process.argv[2];

if (!url) {
  console.log("Please provide url");
  process.exit(1);
}

async function main() {
  try {
    const parsedUrl = new ParseURL(url);

    const res = await fetchRaw({
      port: parsedUrl.port,
      host: parsedUrl.host,
      path: parsedUrl.path,
      schema:  parsedUrl.schema,
    })

    console.log(res);
  } catch(err) {
    console.error(err);
  }
}

main();
