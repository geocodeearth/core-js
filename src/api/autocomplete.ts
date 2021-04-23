import validateApiKey from '../utils/validate_api_key'
import { Params, createQuery } from './params'
import { Options } from '../options'
import { createURL } from '../utils/url'

const createAutocomplete = (
  apiKey: string,
  params?: Params,
  options?: Options
) => {
  if (!validateApiKey(apiKey)) {
    throw new Error('Invalid API key specified.')
  }

  // keep track of how many requests we’ve sent
  // for discarding out of order responses
  let requests = 0
  return async (text: string) => {
    // An autocomplete request promise resolves with a Result, which contains
    // the data from the API, rate limiting info, and whether or not it should be discarded
    // as it was returned out of order
    type Result = {
      features?: any;
      discard?: boolean;
      rateLimit?: RateLimitStatus;
    }

    type RateLimitStatus = {
      delaySecond: number;
      limitSecond: number;
      remainingSecond: number;
      usedSecond: number;
    }

    const current = requests = requests + 1
    return new Promise<Result>((resolve, reject) => {
      const url = createURL('autocomplete', createQuery(apiKey, text, params), options).toString()
      let rateLimit: RateLimitStatus

      fetch(url)
        .then(res => {
          rateLimit = {
            delaySecond: parseInt(res.headers.get('X-Ratelimit-Delay-Second') || ''),
            limitSecond: parseInt(res.headers.get('X-Ratelimit-Limit-Second') || ''),
            remainingSecond: parseInt(res.headers.get('X-Ratelimit-Remaining-Second') || ''),
            usedSecond: parseInt(res.headers.get('X-Ratelimit-Used-Second') || '')
          }

          return res.json()
        })
        .then(({ meta, results, features }) => {
          if (meta?.status_code && results?.error) {
            reject({
              ...results.error,
              statusCode: meta.status_code,
              rateLimit
            })
          }

          if (current < requests) {
            resolve({ discard: true })
          } else {
            resolve({ features, rateLimit })
          }
        })
        .catch(reject)
    })
  }
}

export default createAutocomplete
