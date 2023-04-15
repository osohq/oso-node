# Oso SDK with Express integration

The Oso SDK with Express integration provides helper functions to facilitate hooking Oso into the Express web framework.

## Install

```bash
npm install --save @osohq/express
yarn add @osohq/express
```

## Usage

The Oso SDK should be initialized as early as possible in the main entry module. The Oso SDK can be hooked into Express as a centralized middleware or as a route middleware using the `enforce` function.

```javascript

import { init } from '@osohq/express';
import express from 'express';

const oso = init({
    apiKey: 'YOUR_API_KEY',
    // ...
})

const enforcement = {
  action: 'view',
  resourceType: 'Org',
  resourceId: '123',
};

// Centralized enforcement
app.use(oso.enforce(enforcement));

// Per-route enforcement
app.get('/', oso.enforce(enforcement), (_req, _res) => {
  // ...
});

app.listen(5678);
```

After the Oso SDK is initialized, you may access it by calling `globalOso()`:

```javascript
import { globalOso } from '@osohq/node';

oso = globalOso();
```

The Oso SDK may be further configured by setting relevant fields in the `ConfigOptions` object passed on `init`.

## Integration Options

By default,
- Actor ID is a hardcoded value of `_`. You may override the Actor ID using the setting [`defaultActorId`](#user-identification) when initializing the Oso SDK.
- Action is inferred from the HTTP method. If you have a different set of permissions from the defaults, you may override the mapped value by setting `defaultAction` when initializing the Oso SDK.
- HTTP 404 is returned on authorization failure. You may specify a custom error handler by setting `defaultErrorHandler` when initializing the Oso SDK.

### User Identification

You may provide a function to determine the Actor Id by setting `defaultActorId` when initializing the Oso SDK.
```javascript
import { init } from '@osohq/express';
import { Request } from 'express';

init({
  apiKey: 'YOUR_API_KEY',
  // Hardcode the actor Id to `admin`
  defaultActorId: (_req: Request) => 'admin',
});
```

### Action Identification

You may provide a function to determine the action by setting `defaultAction` when initializing the Oso SDK.
```javascript
import { init } from '@osohq/express';
import { Request } from 'express';

init({
  apiKey: 'YOUR_API_KEY',
  // Hardcode the action to `view`
  defaultAction: (_req: Request) => 'view',
});
```

### Custom Error Handling

You can provide a function to determine the response on authorization failure.
```javascript
import { init } from '@osohq/express';
import { Response, NextFunction } from 'express';

init({
  apiKey: 'YOUR_API_KEY',
  // Return HTTP 418 on authorization failure
  defaultErrorHandler: (res: Response, _next: NextFunction) => {
    res.send(418).send("I'm a teapot");
    return;
  },
});
```

## Supported Versions

- Express: 4.x
