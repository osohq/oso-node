import { version } from '../package.json';
import { OSO_URL } from './consts';
import { Fact, Instance, Oso } from 'oso-cloud';

export class OsoSdk extends Oso {
  #cache: Map<string, boolean>;
  constructor(apiKey: string, userAgent?: string) {
    super(OSO_URL, apiKey, userAgent || `OsoSdk/${String(version)}`);
    this.#cache = new Map();
  }

  async authorize(
    actor: Instance,
    action: string,
    resource: Instance,
    contextFacts?: Fact[] | undefined
  ): Promise<boolean> {
    const args = JSON.stringify([actor, action, resource]);
    try {
      const res = await super.authorize(actor, action, resource, contextFacts);
      this.#cache.set(args, res);
      return res;
    } catch (e) {
      console.log(this.#cache);
      const cacheEntry = this.#cache.get(args);
      if (cacheEntry !== undefined) return cacheEntry;
      throw e;
    }
  }
}
