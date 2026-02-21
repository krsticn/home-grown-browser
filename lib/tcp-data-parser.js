export class TCPDataParser {
    constructor(resStr) {
          const arr = resStr.split("\r\n\r\n");
          this.headersStr = arr[0];
          this.bodyStr = arr[1];
    }

    get headers(){
          const [status, ...restHeaders]  = this.headersStr.split('\r\n');

          const headersMap = new Map();

          for (const header of restHeaders) {
              const [key, value] = header.split(':');
              headersMap.set(key.trim(), value.trim());
          }

          return headersMap;
    }

    get body() {
        return this.bodyStr; 
    }
}
