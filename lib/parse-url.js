
const SCHEMA_SEPARATOR = '://';
const SUPPORTED_SCHEMAS = ['http', 'https'];

export class ParseURL {
  constructor(url) {
    const segments = this.#getUrlSegments(url);

    const { schema, path, port, host } = this.#parse(segments);

    this.schema = schema;
    this.host = host;
    this.path = path;
    this.port = port;
  }

  #getUrlSegments(url) {
    if (!url.includes(SCHEMA_SEPARATOR)) {
      throw new Error('Invalid URL format');
    }

    const [schema, restUrl] = url.split(SCHEMA_SEPARATOR);

    if (!schema || !restUrl) {
      throw new Error('Invalid URL format');
    }
    if (!SUPPORTED_SCHEMAS.includes(schema)) {
      throw new Error(`Unsupported schema. List of supported schemas [${SUPPORTED_SCHEMAS.join(', ')}]`);
    }

    return { schema, restUrl };
  }

  #parse({ schema, restUrl }) {
    if (!restUrl.includes('/')) {
      restUrl += '/';
    }

    const slashIndex = restUrl.indexOf('/');
    const colonIndex = this.#getColonIndex(restUrl);

    const port = this.#getPort({ restUrl, slashIndex, colonIndex });

    return {
      schema: schema,
      path: restUrl.slice(slashIndex),
      host: restUrl.slice(0, colonIndex ?? slashIndex),
      port: port ?? (schema === 'https' ? 443 : 80),
    }
  }


  #getColonIndex(restUrl) {
    const colonIndex = restUrl.indexOf(':');
    return colonIndex === -1 ? null : colonIndex;
  }

  #getPort({ restUrl, slashIndex, colonIndex }) {
    if (!colonIndex) {
      return null;
    }

    const port = restUrl.slice(colonIndex + 1, slashIndex);
    const portNum = Number(port);

    if (isNaN(portNum)) {
      throw new Error('Port must be a number');
    }

    return portNum;
  }
}
