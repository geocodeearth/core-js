import { Query } from '../api/autocomplete/params'
import { Options, defaultOptions } from '../options'

type Endpoint = 'autocomplete'

export const createURL = (endpoint: Endpoint, query: Query, { host, client }: Options = defaultOptions): URL => {
  const url = new URL(`/v1/${endpoint}`, `https://${host}`)

  if (client !== undefined) {
    query.client = client
  }

  url.search = new URLSearchParams(query).toString()
  return url
}
