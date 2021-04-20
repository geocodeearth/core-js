import validateApiKey from '../utils/validate_api_key'

interface Options {
  apiHost?: string
  apiEndpoint?: string
  apiVersion?: 'v1'
  lang?: string
  size?: number
  sources?: (
    'openstreetmap' |
    'openaddresses' |
    'geonames' |
    'whosonfirst'
  )[]
  layers?: (
    'address' |
    'borough' |
    'coarse' |
    'country' |
    'county' |
    'localadmin' |
    'locality' |
    'macrocounty' |
    'macroregion' |
    'neighbourhood' |
    'postalcode' |
    'region' |
    'street' |
    'venue'
  )[]
  boundary?: {
    country?: string
    gid?: string
    circle?: {
      lat: number
      lon: number
      radius: number
    }
    rect?: {
      minLon: number
      maxLon: number
      minLat: number
      maxLat: number
    }
  }
  focus?: {
    lat: number
    lon: number
  }
}

const defaultOptions: Options = {
  apiHost: 'https://api.dev.geocode.earth',
  apiVersion: 'v1',
  apiEndpoint: 'autocomplete',
  size: 5
}

const createAutocomplete = (apiKey: string, opts?: Options) => {
  if (!validateApiKey(apiKey)) {
    throw new Error('Invalid API key specified.')
  }

  // override default options with user supplied options
  const options: Options = {
    ...defaultOptions,
    ...opts
  }

  let url = new URL(`/${options.apiVersion}/${options.apiEndpoint}`, options.apiHost)

  // keep track of how many requests we’ve sent
  // for discarding out of order responses
  let requests = 0
  return async (text: string) => {
    const current = requests = requests + 1

    // a Query is used to construct request parameters for the API
    type Query = {
      text: string;
      api_key: string;
      lang?: string;
      size?: string;
      layers?: string;
      sources?: string;
      ['boundary.country']?: string;
      ['boundary.gid']?: string;
      ['boundary.circle.lat']?: string;
      ['boundary.circle.lon']?: string;
      ['boundary.circle.radius']?: string;
      ['boundary.rect.min_lat']?: string;
      ['boundary.rect.max_lon']?: string;
      ['boundary.rect.min_lat']?: string;
      ['boundary.rect.max_lat']?: string;
      ['focus.point.lat']?: string;
      ['focus.point.lon']?: string;
    }

    const q: Query = {
      text,
      api_key: apiKey
    }

    if (options.lang) {
      q.lang = options.lang
    }

    if (options.size) {
      q.size = options.size.toString()
    }

    if (options.boundary?.country) {
      q['boundary.country'] = options.boundary.country
    }

    if (options.boundary?.gid) {
      q['boundary.gid'] = options.boundary.gid
    }

    if (options.boundary?.circle) {
      q['boundary.circle.lat'] = options.boundary.circle.lat.toString()
      q['boundary.circle.lon'] = options.boundary.circle.lon.toString()
      q['boundary.circle.radius'] = options.boundary.circle.lon.toString()
    }

    if (options.boundary?.rect) {
      q['boundary.rect.min_lat'] = options.boundary.rect.minLat.toString()
      q['boundary.rect.max_lat'] = options.boundary.rect.maxLon.toString()
      q['boundary.rect.min_lon'] = options.boundary.rect.minLon.toString()
      q['boundary.rect.max_lon'] = options.boundary.rect.maxLon.toString()
    }

    if (options.focus) {
      q['focus.point.lat'] = options.focus.lat.toString()
      q['focus.point.lon'] = options.focus.lon.toString()
    }

    if (!!options.layers?.length) {
      q.layers = options.layers.map(l => l.trim()).join(',')
    }

    if (!!options.sources?.length) {
      q.sources = options.sources.map(l => l.trim()).join(',')
    }

    url.search = new URLSearchParams(q).toString()

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

    return new Promise<Result>((resolve, reject) => {
      let rateLimit: RateLimitStatus

      fetch(url.toString())
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
