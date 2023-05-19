import { OsoSdk, OsoSdkError, globalOso, init } from '@osohq/node';

describe('test init Oso handle', () => {
  let oso: OsoSdk;

  test('accessing shared reference before calling `init` throws error', () => {
    expect(globalOso).toThrow(OsoSdkError);
  });

  test('shared reference returns shared handle', () => {
    oso = init({ apiKey: 'YOUR_API_KEY', shared: true }, OsoSdk);

    expect(globalOso()).toStrictEqual(oso);
  });

  test('calling `init` with `shared: true` throws error', () => {
    expect(() => {
      init({ apiKey: 'YOUR_API_KEY', shared: true }, OsoSdk);
    }).toThrow(OsoSdkError);
  });

  test('calling `init` with `shared: false` returns unique handle', () => {
    const instanceOso = init({ apiKey: 'YOUR_API_KEY', shared: false }, OsoSdk);

    expect(globalOso()).not.toEqual(instanceOso);
  });
});

describe('can still serve responses when Oso Cloud is unreachable', () => {
  let oso: OsoSdk;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    oso = init(
      { apiKey: 'e_0123456789_12345_osotesttoken01xiIn', shared: false },
      OsoSdk
    );
    const api = oso.api;

    mockPost = jest.spyOn(api, '_post');
  });

  test('basic test', async () => {
    expect.assertions(4);

    mockPost
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementationOnce((_path, _params, _body) =>
        Promise.resolve({ allowed: false })
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementationOnce((_path, _params, _body) =>
        Promise.resolve({ allowed: true })
      );

    const alice = { type: 'User', id: 'alice' };
    const acme = { type: 'Organization', id: 'acme' };

    await expect(oso.authorize(alice, 'delete', acme)).resolves.toBe(false);
    await expect(oso.authorize(alice, 'read', acme)).resolves.toBe(true);

    // Oso Cloud outage begins...
    mockPost.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_path, _params, _body) => Promise.reject(new Error('500 buddy'))
    );

    const cacheMiss = oso.authorize(alice, 'delete', acme);
    await expect(cacheMiss).resolves.toBe(false);

    const cacheHit = oso.authorize(alice, 'read', acme);
    await expect(cacheHit).resolves.toBe(true);
  });
});
