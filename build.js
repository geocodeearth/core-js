const esbuild = require('esbuild')

const package = 'geocode-earth-core'
const opts = {
  entryPoints: ['src/index.js'],
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
}

// ESM (Browser)
esbuild.build({
  ...opts,
  format: 'esm',
  outfile: `dist/${package}.esm.js`,
}).catch(() => process.exit(1))


// CommonJS (Node)
esbuild.build({
  ...opts,
  platform: 'node',
  outfile: `dist/${package}.cjs.js`,
}).catch(() => process.exit(1))
