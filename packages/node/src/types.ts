// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConfigOptions<R = (...args: any) => any, U = (...args: any) => any> {
  apiKey: string
  shared?: boolean
  defaultActorId?: R
  defaultAction?: R
  defaultErrorHandler?: U
}
