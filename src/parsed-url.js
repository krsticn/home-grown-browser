import { ParsedFileUrl } from "./parsed-file-url.js";
import { ParsedHttpUrl } from "./parsed-http-url.js";
import { HTTP_SUPPORTED_SCHEMAS, FILE_SUPPORTED_SCHEMAS } from "./constants/schemas.js";

const SCHEMA_SEPARATOR = '://';

export class ParsedUrl {
    static from(url) {
        if (!url.includes(SCHEMA_SEPARATOR)) {
            throw new Error('Invalid URL format');
        }

        const [schema, rest] = url.split(SCHEMA_SEPARATOR);

        if (!schema || !rest) {
            throw new Error('Invalid URL format');
        }

        if (HTTP_SUPPORTED_SCHEMAS.includes(schema)) {
            return new ParsedHttpUrl(schema, rest);
        }
        if (FILE_SUPPORTED_SCHEMAS.includes(schema)) {
            return new ParsedFileUrl(schema, rest);
        }

        throw new Error('Unsuported schema');
    }
}