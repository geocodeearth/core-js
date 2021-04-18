import validateApiKey from './validate_api_key'

test('accepts valid keys', () => {
  const valid = [
    'ge-2dced32726723c0f',
    'ge-4ade3c0cb1c0da23'
  ]

  valid.forEach(k => {
    expect(validateApiKey(k)).toBe(true)
  })
})

test('rejects invalid keys', () => {
  const invalid = [
    '',
    'foo',
    'ge-foo',
    'ge-xxx123yyy456zzzz',
    'ge-4ade3c0cb1c0da234ade3c0cb1c0da23'
  ]

  invalid.forEach(k => {
    expect(validateApiKey(k)).toBe(false)
  })
})
