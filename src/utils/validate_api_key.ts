// validates if a passed in value could be a valid API key in the sense that it follows the
// required pattern for Geocode Earth API keys. It does not query the API to actually test the key.
const pattern = new RegExp(/^ge-[0-9a-f]{16}$/)
export default (key: string): boolean => pattern.test(key)
