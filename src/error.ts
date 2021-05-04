import { RateLimit } from './ratelimit'

type errorType = (
  // Pelias error
  'GeocodingError' |

  // Rate limiter errors
  'KeyError' |
  'ExpiredKeyError' |
  'DisabledKeyError' |
  'QpdExceededError' |
  'QpsExceededError' |
  'GatewayTimeout' |
  'GatewayError'
)

export class APIError extends Error {
  readonly type: errorType
  readonly statusCode: number
  readonly messages: string[]
  readonly rateLimit: RateLimit

  constructor (type: errorType, statusCode: number, rateLimit: RateLimit, ...messages: string[]) {
    super(messages.join('. '))

    this.type = type
    this.statusCode = statusCode
    this.rateLimit = rateLimit
    this.messages = messages
  }
}
