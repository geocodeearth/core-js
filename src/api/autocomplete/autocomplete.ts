import validateApiKey from '../../utils/validate_api_key'
import { Params, createQuery } from './params'
import { Result } from './result'
import { Options } from '../../options'
import { createURL } from '../../utils/url'

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
  return async (text: string): Promise<Result> => {
    const current = requests = requests + 1
    return new Promise((resolve, reject) => {
      const url = createURL('autocomplete', createQuery(apiKey, text, params), options).toString()
      const result: Result = {}

      fetch(url)
        .then(res => {
          result.rateLimit = {
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
              rateLimit: result.rateLimit
            })
          }

          if (current < requests) {
            resolve({ ...result, discard: true })
          } else {
            resolve({ ...result, features })
          }
        })
        .catch(reject)
    })
  }
}

export default createAutocomplete
