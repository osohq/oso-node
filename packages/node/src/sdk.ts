import { version } from '../package.json';
import { OSO_URL } from './consts';
import { Oso } from 'oso-cloud';

export class OsoSdk extends Oso {
  constructor(apiKey: string, userAgent?: string) {
    super(OSO_URL, apiKey, userAgent || `OsoSdk/${String(version)}`);
  }
}
