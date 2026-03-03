import fetchRaw  from './lib/fetch-raw.js';
import { ParseURL } from './lib/parse-url.js';
import { getParsedResponse } from './lib/parse-response.js';

const url = process.argv[2];

if (!url) {
  console.log("Please provide url");
  process.exit(1);
}

async function main() {
  try {
    const parsedUrl = new ParseURL(url);

    const responseStr = await fetchRaw({
      port: parsedUrl.port,
      host: parsedUrl.host,
      path: parsedUrl.path,
      schema:  parsedUrl.schema,
    })

    const parsedResponse = getParsedResponse(responseStr);
    console.log(parsedResponse);
  } catch(err) {
    console.error(err);
  }
}

main();
