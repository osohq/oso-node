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
  expect.assertions(3);

  let oso: OsoSdk;
  let mockReq: jest.SpyInstance;

  // OsoSdk > Oso > Api > _req
  beforeEach(() => {
    oso = init({ apiKey: 'YOUR_API_KEY', shared: false }, OsoSdk);
    const api = oso.api;

    mockReq = jest.spyOn(api, '_req');
  });

  test('basic test', async () => {
    const errorMessage = '500 buddy';
    mockReq
      .mockImplementationOnce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_path, _method, _params, _body) => Promise.resolve({ allowed: true })
      )
      .mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_path, _method, _params, _body) =>
          Promise.reject(new Error(errorMessage))
      );

    const beforeTheOutage = oso.authorize('cache', 'rules', 'everything');
    await expect(beforeTheOutage).resolves.toBe(true);

    // Oso Cloud outage begins...

    // Sanity check that mocks are working as expected.
    const cacheMiss = oso.authorize('cache', 'is', 'beans');
    await expect(cacheMiss).rejects.toThrowError(errorMessage);

    const cacheHit = oso.authorize('cache', 'rules', 'everything');
    await expect(cacheHit).resolves.toBe(true);

    // expect(mockReq).toHaveBeenCalledWith(
    //   '/authorize',
    //   'POST',
    //   {},
    //   {
    //     action: 'rules',
    //     actor_id: 'cache',
    //     actor_type: 'String',
    //     context_facts: [],
    //     resource_id: 'everything',
    //     resource_type: 'String',
    //   }
    // );
  });
});
