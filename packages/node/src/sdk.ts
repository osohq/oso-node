import { version } from '../package.json';
import { OSO_URL } from './consts';
import DatabaseConstructor, { Database } from 'better-sqlite3';
import { Fact, Instance, Oso } from 'oso-cloud';

// TODO(gj): share `toValue` in oso-service/clients/js/src/helpers.ts
const toValue = (i: Instance) =>
  i === null
    ? { type: null, id: null }
    : typeof i === 'string'
    ? { type: 'String', id: i }
    : { type: i.type || null, id: i.id || null };

export class OsoSdk extends Oso {
  #db: Database;

  constructor(apiKey: string, userAgent?: string) {
    super(OSO_URL, apiKey, userAgent || `OsoSdk/${String(version)}`);

    this.#db = new DatabaseConstructor('./cache.db', { readonly: true });
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
      const { type: actorType, id: actorId } = toValue(actor);
      const { type: resourceType, id: resourceId } = toValue(resource);
      const res = this.#db
        .prepare(
          `SELECT * FROM allow_cache
                       WHERE (actor_type = ? OR actor_type = '_')
                       AND (actor_val = ? OR actor_val = '_')
                       AND (action_val = ? OR action_val = '_')
                       AND (resource_type = ? OR resource_type = '_')
                       AND (resource_val = ? OR resource_val = '_')`
        )
        .bind(actorType, actorId, action, resourceType, resourceId)
        .get();
      return res !== undefined;
    }
  }
}
