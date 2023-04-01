import { Request, Response, NextFunction } from 'express';

export type FromRequest = (req: Request) => string | Promise<string>;
export type OnResponse = (
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export interface Enforce {
  action?: string | ((req: Request) => string | Promise<string>);
  resourceType: string | ((req: Request) => string | Promise<string>);
  resourceId: string | ((req: Request) => string | Promise<string>);
}
