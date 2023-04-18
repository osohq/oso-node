# Base Oso SDK

The Base Oso SDK provides helpers for interacting with Oso Cloud. If you are
using a web framework, we recommend using the integration specific to that web
framework.

## Install

```bash
npm install --save @osohq/node
yarn add @osohq/node
```

## Usage

The Oso SDK should be initialized as early as possible in the main entry module.

```javascript
import { init } from '@osohq/node';

init({
    apiKey: 'YOUR_API_KEY',
    // ...
})
```

After the Oso SDK is initialized, you may access it by calling `globalOso()`:

```javascript
import { globalOso } from '@osohq/node';

oso = globalOso();
```

The Oso SDK may be further configured by setting relevant fields in the `ConfigOptions` object passed on `init`.
