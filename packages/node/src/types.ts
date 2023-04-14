// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConfigOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  R = (...args: any) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U = (...args: any) => unknown
> {
  apiKey: string;
  shared?: boolean;
  defaultActorId?: R;
  defaultAction?: R;
  defaultErrorHandler?: U;
}
