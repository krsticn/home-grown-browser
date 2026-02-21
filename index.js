import { Logger } from './lib/logger.js';
import { CustomURL } from './lib/custom-url.js';

global.logger = new Logger();

const parsedUrl = new CustomURL("http://example.com/");

parsedUrl.request();

