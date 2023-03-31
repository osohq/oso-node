export class OsoSdkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OsoSdkError'
  }
}
