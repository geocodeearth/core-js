import autocomplete from './autocomplete'

test('prepends input', () => {
  const result = autocomplete('Berlin')
  expect(result).toMatch(/^\[autocomplete\]/)
})
