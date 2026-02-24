import { Socket } from 'net';
import { connect as tlsConnect } from 'node:tls';
import { ParseTCPData } from './parse-tcp-data.js';
import { ParseHTML } from './parse-html.js';

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

    this.url = url;
    this.schema = schema;
    this.host = restUrl.slice(0, slashIndex);
    this.path = restUrl.slice(slashIndex);
  }

  getDecodedStr(arrayBuffer) {
    const uInt8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(uInt8Array);
  }

  request() {
    let socket = new Socket();

    if (this.schema === 'https') {
      socket = tlsConnect({
        port: 443,
        host: this.host,
        servername: this.host,
        rejectUnauthorized: false,
      });
    } else {
      socket.connect(80, this.host);
    }

    socket.on('connect', () => {
      logger.log('Connected to TCP server');
      socket.write(`GET ${this.path} HTTP/1.0\r\nHost: ${this.host}\r\n\r\n`, 'utf-8');
    })

    socket.on('data', (data) => {
      try {
        const decodedStr = this.getDecodedStr(data);
        const parsedTcpData = new ParseTCPData(decodedStr);
        const parsedHtml = new ParseHTML(parsedTcpData.body);
        console.log(parsedHtml.html)
      } catch (error) {
        console.log(error)
      }
    });

    socket.on('error', (error) => {
      logger.log('Error while connecting to TCP server', error);
    });

    socket.on('close', () => {
      logger.log('Connection to TCP server is closed');
    });
  }
}
