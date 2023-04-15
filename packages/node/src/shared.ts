import { OsoSdk } from './sdk';

export interface Shared {
  /**
   * Global Oso SDK object.
   */
  oso?: OsoSdk;
}

export const SHARED_OBJ: Shared = {};
