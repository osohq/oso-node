import { OSO_URL } from './consts';
import { OsoSdkError } from './errors';
import { Oso } from 'oso-cloud';

export class OsoSdk extends Oso {
  private static _shared: OsoSdk | null = null;

  constructor(apiKey: string) {
    super(OSO_URL, apiKey);
  }

  public static getInstance(): OsoSdk {
    if (!OsoSdk._shared) {
      throw new OsoSdkError('`init` must first be called with shared = true');
    }

    return OsoSdk._shared;
  }

  public static _setInstance(oso: OsoSdk) {
    OsoSdk._shared = oso;
  }
}
