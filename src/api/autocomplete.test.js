import createAutocomplete from './autocomplete'

test('throws error with invalid API key', () => {
  expect(() => createAutocomplete('')).toThrow()
})

test('returns a function with valid API key', () => {
  const a = createAutocomplete('ge-4ade3c0cb1c0da23')
  expect(typeof a).toBe('function')
})
