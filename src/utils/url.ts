import { Query } from '../api/autocomplete/params'
import { Options, defaultOptions } from '../options'

type Endpoint = 'autocomplete'

export const createURL = (endpoint: Endpoint, query: Query, options: Options): URL => {
  const host = options.host === undefined ? defaultOptions.host : options.host
  const url = new URL(`/v1/${endpoint}`, `https://${host}`)

  if (options.client !== undefined) {
    query.client = options.client
  }

  url.search = new URLSearchParams(query).toString()
  return url
}
