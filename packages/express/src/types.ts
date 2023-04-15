import { Request, Response, NextFunction } from 'express';

export type FromRequest = (req: Request) => string | Promise<string>;
export type OnResponse = (
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export interface Enforce {
  /**
   * Configure the "action" to authorize.
   *
   * Can be hardcoded or derived from the request. If not provided, the
   * default action function is used.
   */
  action?: string | ((req: Request) => string | Promise<string>);

  /**
   * Configure the "resource type" to authorize.
   *
   * Can be hardcoded or derived from the request.
   */
  resourceType: string | ((req: Request) => string | Promise<string>);

  /**
   * Configure the "resource id" to authorize.
   *
   * Can be hardcoded or derived from the request. When used on a route,
   * dynamic path parameters are supported.
   *
   * @example
   * ```js
   * app.get(
   *   "/:id",
   *   oso.enforce({ action, resourceType, resourceId: ":id" }),
   *   (req, res) => { ... }
   * );
   * ```
   */
  resourceId: string | ((req: Request) => string | Promise<string>);
}
