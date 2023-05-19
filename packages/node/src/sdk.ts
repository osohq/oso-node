import { version } from '../package.json';
import { OSO_URL } from './consts';
import DatabaseConstructor, { Database } from 'better-sqlite3';
import { Fact, Instance, Oso } from 'oso-cloud';
import { AuthorizeResult } from 'oso-cloud/dist/src/api';

// TODO(gj): share `toValue` in oso-service/clients/js/src/helpers.ts
const toValue = (i: Instance) =>
  i === null
    ? { type: null, id: null }
    : typeof i === 'string'
    ? { type: 'String', id: i }
    : { type: i.type || null, id: i.id || null };

interface AuthorizeQuery {
  actor: Instance;
  action: string;
  resource: Instance;
}

type FactSet = {
  predicate: string;
  args?: Instance[];
}[];

export class OsoSdk extends Oso {
  #db: Database;
  #cache: Map<string, AuthorizeQuery[]>;

  constructor(apiKey: string, userAgent?: string) {
    super(OSO_URL, apiKey, userAgent || `OsoSdk/${String(version)}`);

    this.#db = new DatabaseConstructor('./cache.db', { readonly: true });
    this.#cache = new Map();
  }

  async authorize(
    actor: Instance,
    action: string,
    resource: Instance,
    contextFacts?: Fact[] | undefined
  ): Promise<boolean> {
    const { type: actorType, id: actorId } = toValue(actor);
    const { type: resourceType, id: resourceId } = toValue(resource);
    try {
      const url = `${this.api.url}/api/authorize`;
      const body = {
        actor_type: actorType,
        actor_id: actorId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const response: Response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.api.token}`,
        },
        body: JSON.stringify(body),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const result: AuthorizeResult = await response.json();

      if (result.allowed) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const matchingFactSets = response.headers.get('matching-fact-sets');
        if (matchingFactSets !== null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
          const factSets: FactSet = JSON.parse(matchingFactSets);
          for (const f of factSets) {
            const key = JSON.stringify(f);
            let queries = this.#cache.get(key);
            if (queries === undefined) {
              queries = [
                {
                  actor,
                  action,
                  resource,
                },
              ];
            } else {
              queries.push({
                actor,
                action,
                resource,
              });
            }

            this.#cache.set(key, queries);
          }
        }
      }

      return result.allowed;
    } catch (e) {
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

  async delete(predicate: string, ...args: Instance[]): Promise<void> {
    await super.delete(predicate, ...args);

    const factSet = {
      predicate,
      args: Object.keys({ ...args }).map(v => args[Number(v)]),
    };

    const key = JSON.stringify(factSet);
    const matchedQueries = this.#cache.get(key);

    // TODO: remove from cache db

    this.#cache.delete(key);
  }
}
