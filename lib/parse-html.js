export class ParseHTML {
    constructor(htmlStr = "") {
      this.html = htmlStr;
    }

    get innerText() {
      if (!this.html || this.html.length === 0) {
        throw new Error('No html content');
      }

      let text = '';
      let inTag = false;

      const normalizedHtml = this.html.trim();

      for (let i = 0; i < normalizedHtml.length; i++) {
        const char = normalizedHtml[i];

        if (char === '<') {
          inTag = true;
        } else if (char === '>') {
          inTag = false;
        } else if (!inTag) {
          text += char;
        }
      }

      return text;
    }
}
