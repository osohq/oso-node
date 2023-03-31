import { OsoSdkError } from './errors'
import { OsoSdk } from './sdk'
import { ConfigOptions } from './types'

export { OsoSdkError } from './errors'
export type { ConfigOptions } from './types'
export { OsoSdk } from './sdk'
export { DEFAULT_USER_ID } from './consts'

export function globalOso(): OsoSdk {
  return OsoSdk.getInstance()
}

export function init<T extends OsoSdk>(opts: ConfigOptions, c: new (apiKey: string) => T): T {
  const oso = new c(opts.apiKey)

  if (opts.shared) {
    if (OsoSdk.getInstance()) {
      throw new OsoSdkError('`init` cannot be called multiple times when shared = true')
    }

    OsoSdk._setInstance(oso)
  }

  return oso
}
