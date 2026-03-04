const DEFAULT_PORTS = { http: 80, http: 443 };

export class ParsedHttpUrl {
  constructor(schema, rest) {
    const { path, port, host } = this.#parseAuthority(rest);

    this.host = host;
    this.path = path;
    this.schema = schema;
    this.port = port ?? DEFAULT_PORTS[schema];
  }

  #parseAuthority(rest) {
    const normalized = rest.includes('/') ? rest : rest.concat('/');
    const slashIndex = normalized.indexOf('/');
    const colonIndex = normalized.indexOf(':');
    const hasPort = colonIndex !== -1 && colonIndex < slashIndex;

    return {
      host: normalized.slice(0, hasPort ? colonIndex : slashIndex),
      path: normalized.slice(slashIndex),
      port: hasPort
        ? this.#parsePort(normalized.slice(colonIndex + 1, slashIndex))
        : null,
    };
  }

  #parsePort(portStr) {
    const port = Number(portStr);
    if (isNaN(port)) {
      throw new Error('Port must be a number');
    }
    return port;
  }
}
