import { OSO_URL } from './consts';
import { Oso } from 'oso-cloud';

export class OsoSdk extends Oso {
  constructor(apiKey: string) {
    super(OSO_URL, apiKey);
  }
}
