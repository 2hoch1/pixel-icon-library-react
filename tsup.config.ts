// @ts-nocheck - esbuild version mismatch between tsup's bundled esbuild and standalone esbuild
import { defineConfig, Options } from 'tsup';
import svgrPlugin from 'esbuild-plugin-svgr';

export default defineConfig({
  // Keep per-icon modules so consumers can tree-shake and only import what they need.
  entry: [
    'src/index.ts',
    'src/icon-types.ts',
    'src/dynamicIconImports.ts',
    'src/icons/index.ts',
    'src/icons/*.tsx',
  ],
  format: ['esm', 'cjs'],
  // Generate declarations for all entrypoints (including per-icon modules)
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  treeshake: true,
  // Enable code splitting so the named dynamic imports in dynamicIconImports
  // resolve to per-icon chunks (lazy-loaded on demand) instead of inlining the
  // entire icon set into the map. ESM only; CJS cannot split and inlines.
  splitting: true,
  preserveModules: true,
  // Bundle upstream icons so consumers don't need loaders for .svg/.tsx in node_modules
  noExternal: ['@hackernoon/pixel-icon-library'],
  esbuildPlugins: [
    svgrPlugin({
      exportType: 'default',
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: '(id)',
            },
          },
        ],
      },
    }) as any,
  ],
  target: 'es2020',
  outDir: 'dist',
  /** Maps each output format to its JS extension: `.cjs` for CommonJS, `.js` for ESM. */
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
} as Options);
