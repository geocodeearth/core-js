# Geocode Earth Core JS

This repo currently contains demo code to show what the structure and build tooling for the core API client in JavaScript could look like.

The idea is that this repo is only an API client and does not include UI functionality. It will be consumed by other libraries, like an autocomplete library that will implement the UI parts.

**Important: The APIs are just an example and not actually implemented yet**

## Build tooling

- We use [`esbuild`](https://esbuild.github.io/) to bundle the code
- Tests use [jest](https://jestjs.io/)
- [Standard](https://standardjs.com/) is used for linting.

## Commands

```bash
# creates ESM and CommonJS builds in `./dist`
$ npm run build

# runs tests
$ npm test

# removes dist folder
$ npm run clean

# run standard
$ npm run lint
$ npm run lint-fix # with auto fix
```

## Usage

```js
import { createAutocomplete } from 'geocode-earth-core'
const autocomplete = createAutocomplete('ge-abc123')
autocomplete('berlin').then(console.log)
```

### Params

`createAutocomplete` accepts parameters as a second argument, for example:

```js
createAutocomplete('ge-abc123', {
  size: 5,
  focusPoint: {
    lat: 52.520008,
    lon: 13.404954
  }
})
```

All options can be found in `src/api/autocomplete/params.ts`.
