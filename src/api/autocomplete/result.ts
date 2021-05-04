import { RateLimit } from '../../ratelimit'

// An autocomplete request promise resolves with a Result, which contains
// the data from the API, rate limiting info, and whether or not it should be discarded
// if it was returned out of order
export interface Result {
  features?: any // TODO: define this
  discard?: boolean
  rateLimit?: RateLimit
}
