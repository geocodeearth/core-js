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

### ESM

```js
import { autocomplete } from 'geocode-earth-core'
autocomplete("Berlin")
```

The ESM build can also be referenced _directly_ in the browser like so:

```html
<script type="module">
  // or whatever path to the esm build
  import { autocomplete } from "/dist/geocode-earth-core.esm.js"
  console.log(autocomplete("Berlin"))
</script>
```
