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
  splitting: false,
  preserveModules: true,
  // Bundle upstream icons so consumers don't need loaders for .svg/.tsx in node_modules
  noExternal: ['@hackernoon/pixel-icon-library'],
  esbuildPlugins: [
    svgrPlugin({
      exportType: 'default',
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                // Don't convert colors - we'll handle this in React
                convertPathData: false,
              },
            },
          },
          {
            name: 'convert-colors',
            fn: () => ({
              element: {
                enter(node) {
                  // Replace fill and stroke with currentColor, but preserve "none" and "inherit"
                  if (node.attributes) {
                    if (node.attributes.fill) {
                      const fill = node.attributes.fill;
                      if (fill && fill !== 'none' && fill !== 'inherit') {
                        node.attributes.fill = 'currentColor';
                      }
                    }
                    if (node.attributes.stroke) {
                      const stroke = node.attributes.stroke;
                      if (stroke && stroke !== 'none' && stroke !== 'inherit') {
                        node.attributes.stroke = 'currentColor';
                      }
                    }
                  }
                },
              },
            }),
          },
        ],
      },
    }) as any,
  ],
  target: 'es2020',
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
} as Options);
