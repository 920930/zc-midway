import { MidwayHttpError } from '@midwayjs/core';
import { HttpStatus } from '@midwayjs/core';

export class IndexError extends MidwayHttpError {
  constructor(msg: string, code: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(msg, code);
  }
}