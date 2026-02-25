export class ParseResponse {
    constructor(resStr) {
          const arr = resStr.split("\r\n\r\n");

          this.headersStr = arr[0];
          this.bodyStr = arr[1];

          const [statusHeader, ...restHeaders]  = this.headersStr.split('\r\n');

          this.statusHeader = statusHeader;
          this.restHeaders = restHeaders;
    }

    get headers() {
          const headersMap = new Map();

          for (const header of this.restHeaders) {
              const [key, value] = header.split(':');

              const normalizedKey = key.trim().toLowerCase();
              const normalizedValue = value.trim();

              console.assert(normalizedKey !== "transfer-encoding", 'Transfer-Encoding header is present');
              console.assert(normalizedKey !== "content-encoding", 'Content-Encoding header is present');

              headersMap.set(normalizedKey, normalizedValue);
          }

          return headersMap;
    }

    get body() {
        return this.bodyStr; 
    }

    get status() {
        const arr = this.statusHeader.split(' ');
        return {
           protocol: arr[0],
           status: arr[1],
           ok: arr[2] === 'OK',
        }
    }
}
