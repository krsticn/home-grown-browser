import { createConnection } from 'net';
import { connect as createTLSConnection } from 'node:tls';
import { ParseResponse } from './parse-response.js';
import { ParseBody } from './parse-body.js';

const SUPPORTED_SCHEMAS = ['http', 'https'];

export class ParseURL {
  constructor(url) {
    if (!url.includes("://")) {
      throw new Error('Invalid URL format');
    }

    let [schema, restUrl = ""] = url.split("://");

    if (!SUPPORTED_SCHEMAS.includes(schema)) {
      throw new Error(`This browser does not support this schema. Supported schemas [${SUPPORTED_SCHEMAS.join(", ")}]`);
    }

    if (!restUrl) {
      throw new Error("Missing host");
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

  getDecodedArrBuff(arrayBuffer) {
    const uInt8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(uInt8Array);
  }

  request() {
    let responseStr = '';
    let socket = null;

    if (this.schema === 'https') {
      socket = createTLSConnection({
        port: this.port || 443,
        host: this.host,
        servername: this.host,
        rejectUnauthorized: false,
      });
    } else {
      socket = createConnection({
        port: this.port || 80,
        host: this.host,
      })
    }

    socket.on('connect', () => {
      logger.log('Connected to TCP server');
      socket.write(`GET ${this.path} HTTP/1.0\r\nHost: ${this.host}\r\n\r\n`, 'utf-8');
    })

    socket.on('data', (arrayBuffer) => {
      responseStr += this.getDecodedArrBuff(arrayBuffer);
    });

    socket.on('error', (error) => {
      logger.log('Error while connecting to TCP server', error);
    });

    socket.on('close', () => {
      try {
        const parsedResponseStr = new ParseResponse(responseStr);
        const parsedBody = new ParseBody(parsedResponseStr.body);
        console.log(parsedBody.innerText)
      } catch (error) {
        console.log(error)
      }
      logger.log('Connection to TCP server is closed');
    });
  }
}
