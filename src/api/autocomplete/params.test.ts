import { Params, createQuery } from './params'

test('createQuery excludes empty fields', () => {
  const params: Params = {
    lang: 'de',
    layers: undefined,
    sources: []
  }

  expect(createQuery('ge-abcabccbacbacbac', 'berlin', params)).toStrictEqual({
    api_key: 'ge-abcabccbacbacbac',
    text: 'berlin',
    lang: 'de'
  })
})
