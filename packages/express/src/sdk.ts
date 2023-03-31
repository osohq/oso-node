import { Enforce, FromRequest, OnResponse } from './types'
import { OsoSdk, OsoSdkError, DEFAULT_USER_ID } from '@osohq/node'
import { Request, Response, NextFunction } from 'express'
import { Key, pathToRegexp } from 'path-to-regexp'

function tryPathParam(req: Request, path: string) {
  const keys: Key[] | undefined = []

  pathToRegexp(path, keys, {
    // These options are duplicated from express.js
    // https://github.com/expressjs/express/blob/4.x/lib/router/index.js#L500
    sensitive: req.app.enabled('case sensitive routing'),
    strict: req.app.enabled('strict routing'),
    end: true,
  })

  if (keys.length > 1) {
    throw new OsoSdkError('Only one path parameter may be used')
  }

  if (keys.length > 0 && 'name' in keys[0] && keys[0]['name'] in req.params) {
    return req.params[keys[0]['name']]
  } else {
    return path
  }
}

export class ExpressIntegration extends OsoSdk {
  actorIdFromRequest: FromRequest
  actionFromRequest: FromRequest
  errorHandler: OnResponse
  constructor(apiKey: string) {
    super(apiKey)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.actorIdFromRequest = (_req: Request) => DEFAULT_USER_ID
    this.actionFromRequest = (req: Request) => {
      switch (req.method.toLowerCase()) {
        case 'get': {
          return 'view'
        }
        case 'put': {
          return 'update'
        }
        case 'post': {
          return 'create'
        }
        case 'delete': {
          return 'delete'
        }
        default: {
          throw new OsoSdkError(`method ${req.method.toLowerCase()} is not supported`)
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.errorHandler = (res: Response, _next: NextFunction) => {
      res.status(404).send('Not Found')
      return
    }
  }

  enforce = (args: Enforce) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const action = args.action
          ? typeof args.action === 'function'
            ? args.action(req)
            : args.action
          : this.actionFromRequest(req)

        const resourceType = typeof args.resourceType === 'function' ? args.resourceType(req) : args.resourceType

        const resourceId =
          typeof args.resourceId === 'function' ? args.resourceId(req) : tryPathParam(req, args.resourceId)

        const result = await this.authorize({ type: 'User', id: await this.actorIdFromRequest(req) }, await action, {
          type: await resourceType,
          id: await resourceId,
        })

        if (result) {
          next()
        } else {
          await this.errorHandler(res, next)
        }
      } catch (e) {
        console.log(e)
        console.log(this)
        next(e)
      }
    }
  }
}
