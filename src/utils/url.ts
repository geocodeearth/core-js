import { Query } from '../api/params'
import { Options, defaultOptions } from '../options'

type Endpoint = 'autocomplete'

export const createURL = (endpoint: Endpoint, query: Query, options: Options = defaultOptions): URL => {
  const url = new URL(`/v1/${endpoint}`, `https://${options.host}`)
  url.search = new URLSearchParams(query).toString()
  return url
}
