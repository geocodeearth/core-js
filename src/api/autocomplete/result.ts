// An autocomplete request promise resolves with a Result, which contains
// the data from the API, rate limiting info, and whether or not it should be discarded
// if it was returned out of order
export type Result = {
  features?: any // TODO: define this
  discard?: boolean
  rateLimit?: {
    delaySecond: number
    limitSecond: number
    remainingSecond: number
    usedSecond: number
  }
}
