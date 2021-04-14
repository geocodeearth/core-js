import validateApiKey from '../utils/validate_api_key'

const apiHost = 'https://api.dev.geocode.earth'
const apiVersion = 'v1'
const apiEndpoint = 'autocomplete'

// these options can be overwritten by passing options to createAutocomplete
const defaultOptions = {
  apiHost,
  apiVersion,
  apiEndpoint,

  // API options
  size: 5,
  boundary: {
    country: null, // ISO 3166-1
    gid: null // Global ID
  },
  focus: {
    lat: null,
    lon: null
  },
  layers: [],
}

const createAutocomplete = (apiKey, options = {}) => {
  if (!validateApiKey(apiKey)) {
    throw new Error('Invalid API key specified.')
  }

  options = {
    ...defaultOptions,
    ...options,
  }

  let url = new URL(`/${options.apiVersion}/${options.apiEndpoint}`, options.apiHost)

  // keep track of how many requests we’ve sent
  // for discarding out of order responses
  let requests = 0
  return async (text) => {
    const current = requests = requests + 1

    // set query params
    let query = {
      text,
      api_key: apiKey,
      size: options.size,
    }

    if (options.boundary?.country) {
      query['boundary.country'] = options.boundary.country
    }

    if (options.boundary?.gid) {
      query['boundary.gid'] = options.boundary.gid
    }

    if (options.focus?.lat && options.focus?.lon) {
      query['focus.point.lat'] = options.focus.lat
      query['focus.point.lon'] = options.focus.lon
    }

    if (Array.isArray(options.layers) && options.layers?.length > 0) {
      query['layers'] = options.layers.map(l => l.trim()).join(',')
    }

    url.search = new URLSearchParams(query).toString()

    return new Promise(
      function (resolve, reject) {
        let rateLimit

        fetch(url)
          .then(res => {
            rateLimit = {
              delaySecond: parseInt(res.headers.get('X-Ratelimit-Delay-Second')),
              limitSecond: parseInt(res.headers.get('X-Ratelimit-Limit-Second')),
              remainingSecond: parseInt(res.headers.get('X-Ratelimit-Remaining-Second')),
              usedSecond: parseInt(res.headers.get('X-Ratelimit-Used-Second'))
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
      }
    )
  }
}

export default createAutocomplete
