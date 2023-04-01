import { ExpressIntegration } from './sdk';
import { FromRequest, OnResponse } from './types';
import { ConfigOptions, init as sdkInit } from '@osohq/node';

export type { Enforce } from './types';
export { ExpressIntegration } from './sdk';

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
