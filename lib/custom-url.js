import { Socket } from 'net';
import { TCPDataParser } from './tcp-data-parser.js';

export class CustomURL {
  constructor(url)  {
      if (!url.includes("://")) {
        throw new Error('Invalid URL format');
      }

      let [schema, restUrl = ""] = url.split("://");

      if (schema !== 'http') {
        throw new Error('This browser supports only http protocol');
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
      const socket = new Socket();

      socket.connect(80, this.host, () => {
        logger.log('Connected to TCP server');
        socket.write(`GET ${this.path} HTTP/1.0\r\nHost: ${this.host}\r\n\r\n`, 'utf-8');
      })

      socket.on('data', (data) => {
        const decodedStr = this.getDecodedStr(data);
        const tcpDataParser = new TCPDataParser(decodedStr);
        console.log(tcpDataParser.status);
      })

      socket.on('error', (error) => {
        logger.log('Error while connecting to TCP server', error);
      })

      socket.on('close', () => {
        logger.log('Connection to TCP server is closed');
      })
    }
}
