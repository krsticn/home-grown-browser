import { ParseURL } from './lib/parse-url.js';
import fetchRaw  from './lib/fetch-raw.js';
import { ParseBody } from './lib/parse-body.js';
import { ParseResponse } from './lib/parse-response.js';

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

    const parsedResponseStr = new ParseResponse(responseStr);
    const parsedBody = new ParseBody(parsedResponseStr.body);

    console.log(parsedBody.innerText);
  } catch(err) {
    console.error(err);
  }
}

main();
