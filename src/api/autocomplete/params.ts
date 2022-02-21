// Params are a structured format for API params, which are converted to a Query
export interface Params {
  lang?: string
  size?: number
  sources?: string[]
  layers?: string[]
  focusPoint?: {
    lat: number
    lon: number
  }
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
}

// Params are converted to a Query, which is then used to generate a URL query string
interface Query {
  api_key: string
  text: string
  lang?: string
  size?: string
  layers?: string
  sources?: string
  client?: string
  ['boundary.country']?: string
  ['boundary.gid']?: string
  ['boundary.circle.lat']?: string
  ['boundary.circle.lon']?: string
  ['boundary.circle.radius']?: string
  ['boundary.rect.min_lat']?: string
  ['boundary.rect.max_lon']?: string
  ['boundary.rect.max_lat']?: string
  ['boundary.rect.min_lon']?: string
  ['focus.point.lat']?: string
  ['focus.point.lon']?: string
}

export const createQuery = (apiKey: string, text: string, params: Params = {}): Record<string, string> => {
  const q: Query = {
    api_key: apiKey,
    text,
    lang: params.lang,
    size: params.size?.toString(),
    sources: params.sources?.map(l => l.trim()).join(','),
    layers: params.layers?.map(l => l.trim()).join(','),
    'focus.point.lat': params.focusPoint?.lat?.toString(),
    'focus.point.lon': params.focusPoint?.lon?.toString(),
    'boundary.country': params.boundary?.country,
    'boundary.gid': params.boundary?.gid,
    'boundary.circle.lat': params.boundary?.circle?.lat?.toString(),
    'boundary.circle.lon': params.boundary?.circle?.lon?.toString(),
    'boundary.circle.radius': params.boundary?.circle?.lon?.toString(),
    'boundary.rect.min_lat': params.boundary?.rect?.minLat?.toString(),
    'boundary.rect.max_lat': params.boundary?.rect?.maxLon?.toString(),
    'boundary.rect.min_lon': params.boundary?.rect?.minLon?.toString(),
    'boundary.rect.max_lon': params.boundary?.rect?.maxLon?.toString()
  }

  // don’t return empty values (null, undefined, '') as to not have ?size=undefined or empty values in the actual URL query
  return Object.fromEntries(Object.entries(q).filter(([_, v]) => v != null && v !== '')) as Record<string, string>
}
