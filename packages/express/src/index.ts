import { ExpressIntegration } from './sdk';
import { FromRequest, OnResponse } from './types';
import { ConfigOptions, init as sdkInit } from '@osohq/node';

export type { Enforce } from './types';
export { ExpressIntegration } from './sdk';

/**
 * Create an instance of the Oso SDK to be used with Express.
 *
 * @param opts Configuration options for this SDK.
 * @returns the instantiated Oso SDK.
 *
 * @see {@link ConfigOptions} for documentation on configuration options.
 */
export function init(opts: ConfigOptions<FromRequest, OnResponse>) {
  const oso = sdkInit(opts, ExpressIntegration);

  if (opts.defaultActorId !== undefined) {
    oso.actorIdFromRequest = opts.defaultActorId;
  }

  if (opts.defaultAction !== undefined) {
    oso.actionFromRequest = opts.defaultAction;
  }

  if (opts.defaultErrorHandler !== undefined) {
    oso.errorHandler = opts.defaultErrorHandler;
  }

  return oso;
}
