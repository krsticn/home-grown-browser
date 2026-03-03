
const SCHEMA_SEPARATOR = '://';
const SUPPORTED_SCHEMAS = ['http', 'https'];
const DEFAULT_PORTS = { http: 80, http: 443 };

export class ParseURL {
  constructor(url) {
    const [schema, restUrl] = this.#getUrlSegments(url);
    const { path, port, host } = this.#parseAuthority(restUrl);

    this.host = host;
    this.path = path;
    this.port = port ?? DEFAULT_PORTS[schema];
    this.schema = schema;
  }

  #getUrlSegments(url) {
    if (!url.includes(SCHEMA_SEPARATOR)) {
      throw new Error('Invalid URL format');
    }

    const [schema, rest] = url.split(SCHEMA_SEPARATOR);

    if (!schema || !rest) {
      throw new Error('Invalid URL format');
    }
    if (!SUPPORTED_SCHEMAS.includes(schema)) {
      throw new Error(`Unsupported schema. List of supported schemas [${SUPPORTED_SCHEMAS.join(', ')}]`);
    }

    return [schema, rest];
  }

  #parseAuthority(rest) {
    const normalized = rest.includes('/') ? rest : rest.concat('/');
    const slashIndex = normalized.indexOf('/');
    const colonIndex = normalized.indexOf(':');
    const hasPort = colonIndex !== -1 && colonIndex < slashIndex;

    return {
      host: normalized.slice(0, hasPort ? colonIndex : slashIndex),
      path: normalized.slice(slashIndex),
      port: hasPort ? this.#parsePort(normalized.slice(colonIndex + 1, slashIndex)) : null,
    }
  }

  #parsePort(portStr) {
    const port = Number(portStr);
    if (isNaN(port)) {
      throw new Error('Port must be a number');
    }
    return port;
  }
}
