export interface ConfigOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  R = (...args: any) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U = (...args: any) => unknown
> {
  /**
   * Oso Cloud API key.
   */
  apiKey: string;

  /**
   * Create a global Oso SDK object that can be accessed by subsequent calls to
   * `globalOso()`.
   */
  shared?: boolean;

  /**
   * Override the default function used to identify the "actor" to authorize.
   */
  defaultActorId?: R;

  /**
   * Override the default function used to identify the "action" to authorize.
   */
  defaultAction?: R;

  /**
   * Override the default error handling on authorization failure.
   */
  defaultErrorHandler?: U;
}
