import { OsoSdkError } from './errors';
import { OsoSdk } from './sdk';
import { SHARED_OBJ } from './shared';
import { ConfigOptions } from './types';

export { OsoSdkError } from './errors';
export type { ConfigOptions } from './types';
export { OsoSdk } from './sdk';
export { DEFAULT_USER_ID } from './consts';

export function globalOso(): OsoSdk {
  if (SHARED_OBJ.oso === undefined) {
    throw new OsoSdkError('`init` must first be called with shared: true');
  }

  return SHARED_OBJ.oso;
}

export function init<T extends OsoSdk>(
  opts: ConfigOptions,
  c: new (apiKey: string) => T
): T {
  const oso = new c(opts.apiKey);

  if (opts.shared) {
    if (SHARED_OBJ.oso) {
      throw new OsoSdkError(
        '`init` cannot be called multiple times when shared: true'
      );
    }

    SHARED_OBJ.oso = oso;
  }

  return oso;
}
