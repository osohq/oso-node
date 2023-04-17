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
