import { RateLimit } from '../../ratelimit'
import { Feature } from '../../geojson'

// An autocomplete request promise resolves with a Result, which contains
// the data from the API, rate limiting info, and whether or not it should be discarded
// if it was returned out of order
export interface AutocompleteResult {
  features?: Feature[]
  discard?: boolean
  rateLimit?: RateLimit
  warnings?: string[]
}
