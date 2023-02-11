import { MidwayError } from '@midwayjs/core';

export class IndexError extends MidwayError {
  constructor(msg: string, code: string = '400') {
    super(msg, code);
  }
}