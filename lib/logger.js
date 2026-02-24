export class Logger {
  constructor() {}

  log(str, ...rest) {
    console.log(`============ ${str} ============`, ...rest);
  }
}
