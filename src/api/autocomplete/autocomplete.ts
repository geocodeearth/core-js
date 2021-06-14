import validateApiKey from '../../utils/validate_api_key'
import { Params, createQuery } from './params'
import { AutocompleteResult } from './result'
import { Options } from '../../options'
import { createURL } from '../../utils/url'
import { APIError } from '../../error'

const createAutocomplete = (
  apiKey: string,
  params?: Params,
  options?: Options
): (text: string) => Promise<AutocompleteResult> => {
  if (!validateApiKey(apiKey)) {
    throw new Error('Invalid API key specified.')
  }

  // keep track of how many requests we’ve sent
  // for discarding out of order responses
  let requests = 0
  return async (text: string): Promise<AutocompleteResult> => {
    const current = requests = requests + 1
    return await new Promise((resolve, reject) => {
      const url = createURL('autocomplete', createQuery(apiKey, text, params), options).toString()
      const result: AutocompleteResult = {}

      fetch(url)
        .then(async res => {
          const json = await res.json()

          // rate limit info is returned in response headers
          result.rateLimit = {
            delaySecond: parseInt(res.headers.get('X-Ratelimit-Delay-Second') ?? ''),
            limitSecond: parseInt(res.headers.get('X-Ratelimit-Limit-Second') ?? ''),
            remainingSecond: parseInt(res.headers.get('X-Ratelimit-Remaining-Second') ?? ''),
            usedSecond: parseInt(res.headers.get('X-Ratelimit-Used-Second') ?? '')
          }

          // if the response is outside 200 range throw custom error to reject the promise
          if (!res.ok) {
            // Pelias errors
            const { geocoding: { errors } = { errors: [] } } = json
            if (errors.length > 0) {
              throw new APIError('GeocodingError', res.status, result.rateLimit, ...errors)
            }

            // Rate limiter error
            const { results: { error: { type, message } } = { error: { type: '', message: '' } } } = json
            if (type.length > 0 && message.length > 0) {
              throw new APIError(type, res.status, result.rateLimit, message)
            }

            throw new Error(`An unexpected error occured: ${JSON.stringify(json)}`)
          }

          return json
        })
        .then(({ features, geocoding: { warnings } }) => {
          if (current < requests) {
            resolve({ ...result, discard: true })
          } else {
            resolve({ ...result, features, warnings })
          }
        })
        .catch(reject)
    })
  }
}

export default createAutocomplete
