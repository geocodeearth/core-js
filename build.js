const esbuild = require('esbuild')
const { version } = require('./package.json')
const fse = require('fs-extra')

const banner = `/**
* Geocode Earth Core v${version}
* Copyright (c) ${new Date().getFullYear()} Cleared for Takeoff, Inc.
*
* @license MIT
*/`

// clear out the dist folder
const out = 'dist'
fse.emptyDirSync(out)

esbuild.build({
  entryPoints: ['src/geocode-earth-core.ts'],
  outfile: `${out}/geocode-earth-core.esm.js`,
  format: 'esm',
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  banner: {
    js: banner
  }
}).catch(() => process.exit(1))
