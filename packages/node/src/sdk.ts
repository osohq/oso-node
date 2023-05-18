import { version } from '../package.json';
import { OSO_URL } from './consts';
import { Fact, Instance, Oso } from 'oso-cloud';

export class OsoSdk extends Oso {
  constructor(apiKey: string, userAgent?: string) {
    super(OSO_URL, apiKey, userAgent || `OsoSdk/${String(version)}`);
  }

  async authorize(
    actor: Instance,
    action: string,
    resource: Instance,
    contextFacts?: Fact[] | undefined
  ): Promise<boolean> {
    try {
      return await super.authorize(actor, action, resource, contextFacts);
    } catch (e) {
      console.error('GOT', e);
      return true;
    }
  }
}
