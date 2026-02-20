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

      this.schema = schema;
      this.host = restUrl.slice(0, slashIndex);
      this.path = restUrl.slice(slashIndex);
  }
}

const parsedUrl = new CustomURL("http://example.com/foo/bar/bazz");

console.log(parsedUrl.schema);
console.log(parsedUrl.host);
console.log(parsedUrl.path);
