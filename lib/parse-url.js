
const SUPPORTED_SCHEMAS = ['http', 'https'];

export class ParseURL {
  constructor(url) {
    if (!url.includes("://")) {
      throw new Error('Invalid URL format');
    }

    let [schema, restUrl = ""] = url.split("://");

    if (!schema || !restUrl) {
      throw new Error('Malformed url');
    }

    if (!SUPPORTED_SCHEMAS.includes(schema)) {
      throw new Error(`This browser does not support this schema. Supported schemas [${SUPPORTED_SCHEMAS.join(", ")}]`);
    }

    if (!restUrl.includes('/')) {
      restUrl += '/';
    }

    const slashIndex = restUrl.indexOf('/');
    const collonIndex =  restUrl.indexOf(':');
    const isCollon =  collonIndex !== -1

    if (isCollon) {
      const port = restUrl.slice(collonIndex + 1, slashIndex)
      const portNum = Number(port)
      if (isNaN(portNum)) {
        throw new Error('Port must be a number');
      }
      this.port = portNum;
    }

    this.url = url;
    this.schema = schema;
    this.host = restUrl.slice(0, isCollon ?  collonIndex : slashIndex);
    this.path = restUrl.slice(slashIndex);
  }
}
