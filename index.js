import { Socket } from 'net';

class CustomURL {
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

  request() {
      const socket = new Socket();

      socket.connect(80, this.host, () => {
        console.log('Connected to TCP server');
        socket.write(`GET ${this.path} HTTP/1.0\r\nHost: ${this.host}\r\n\r\n`, 'utf-8');
      })

      socket.on('data', (data) => {
        console.log(this.getTextFromBuffer(data));
      })

      socket.on('error', (error) => {
        console.log('Error while connecting to TCP server', error);
      })

      socket.on('close', () => {
        console.log('Connection to TCP server is closed');
      })
    }

    getTextFromBuffer(arrayBuffer) {
      const uInt8Array = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(uInt8Array);
    }
}

const parsedUrl = new CustomURL("http://example.com/");

parsedUrl.request();

