const esbuild = require('esbuild')
const pkg = require('./package.json')

const banner = `/**
 * Geocode Earth Core v${pkg.version}
 * Copyright (c) ${new Date().getFullYear()} Cleared for Takeoff, Inc.
 *
 * @license MIT
*/`

esbuild.build({
  entryPoints: ['src/geocode-earth-core.ts'],
  format: 'esm',
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  banner: {
    js: banner
  },
  outfile: `dist/${pkg.name}.js`
}).catch(() => process.exit(1))
