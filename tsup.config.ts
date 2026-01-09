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
    'src/icons/*.ts',
  ],
  format: ['esm', 'cjs'],
  dts: {
    entry: {
      index: 'src/index.ts',
      'icon-types': 'src/icon-types.ts',
      dynamicIconImports: 'src/dynamicIconImports.ts',
      'icons/index': 'src/icons/index.ts',
    },
  },
  clean: true,
  sourcemap: true,
  minify: false,
  treeshake: true,
  splitting: false,
  preserveModules: true,
  esbuildPlugins: [svgrPlugin() as any],
  target: 'es2020',
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
} as Options);
