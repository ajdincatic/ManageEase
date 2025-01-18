import { AbstractDto } from './abstract.dto';
import { AbstractEntity } from './abstract.entity';

import * as _ from 'lodash';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    toDtos<B extends AbstractDto>(
      this: AbstractEntity<B>[],
      options?: any,
    ): B[];
  }
}

export function extendArrayPrototype() {
  Array.prototype.toDtos = function <B extends AbstractDto>(): B[] {
    return <B[]>_(this)
      .map((item) => item.toDto())
      .compact()
      .value();
  };
}
