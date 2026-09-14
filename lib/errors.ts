// An error whose message is safe and useful to show the guest. Anything else that
// escapes a job is logged and replaced with a generic line.
export class BarkeepError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BarkeepError'
  }
}
