const esbuild = require('esbuild')
const pkg = require('./package.json')

const banner = `/**
 * Geocode Earth Core v${pkg.version}
 * Copyright (c) ${new Date().getFullYear()} Cleared for Takeoff, Inc.
 *
 * @license MIT
*/`

const opts = {
  entryPoints: ['src/index.js'],
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  banner: {
    js: banner
  }
}

// ESM (Browser)
esbuild.build({
  ...opts,
  format: 'esm',
  outfile: `dist/${pkg.name}.esm.js`
}).catch(() => process.exit(1))

// CommonJS (Node)
esbuild.build({
  ...opts,
  platform: 'node',
  outfile: `dist/${pkg.name}.cjs.js`
}).catch(() => process.exit(1))
