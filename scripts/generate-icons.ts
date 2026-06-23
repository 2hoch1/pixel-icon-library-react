import { promises as fs } from 'fs';
import path from 'path';

const dependencyName = '@hackernoon/pixel-icon-library';
const svgRoot = ['icons', 'SVG'];
const variants = ['brands', 'purcats', 'regular', 'solid'] as const;

const header = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Run "npm run generate" to regenerate from @hackernoon/pixel-icon-library.
`;

/** Converts a string to PascalCase by splitting on non-alphanumeric separators and capitalizing each segment. */
const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

type IconEntry = {
  baseName: string;
  componentName: string;
  variant: (typeof variants)[number];
  importPath: string;
};

/** Resolves the installed @hackernoon/pixel-icon-library path under node_modules; throws if the package is absent. */
async function ensureDependencyDir(): Promise<string> {
  const modulePath = path.join(process.cwd(), 'node_modules', dependencyName);
  const exists = await fs
    .access(modulePath)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    throw new Error(
      `${dependencyName} is not installed. Run "npm install" before generating icons.`
    );
  }

  return modulePath;
}

/** Returns a variant's .svg filenames (case-insensitive filter), sorted by locale order. */
async function readIcons(modulePath: string, variant: (typeof variants)[number]) {
  const iconDir = path.join(modulePath, ...svgRoot, variant);
  const entries = await fs.readdir(iconDir);
  return entries
    .filter((file: string) => file.toLowerCase().endsWith('.svg'))
    .sort((a: string, b: string) => a.localeCompare(b));
}

/** Removes a directory and its contents, then recreates it empty so each run starts from a clean state. */
async function cleanDir(dir: string) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

/** Builds the .tsx source for one per-icon module: a forwardRef wrapper that inlines the upstream SVG. */
function buildIconFileContent(entry: IconEntry) {
  return [
    header,
    '/// <reference path="../types/upstream-svg.d.ts" />',
    `import { forwardRef } from 'react';`,
    `import type { ComponentType, SVGProps } from 'react';`,
    `import SvgComponent from '${entry.importPath}';`,
    '',
    `export interface ${entry.componentName}Props extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {`,
    `  size?: number | string;`,
    `  width?: number | string;`,
    `  height?: number | string;`,
    `}`,
    '',
    `/**`,
    ` * @component`,
    ` * @name ${entry.componentName}`,
    ` * @description Pixel icon component from @hackernoon/pixel-icon-library`,
    ` * @param props - SVG element props with optional size (supports className for styling with text-white, text-black, etc.)`,
    ` * @returns JSX Element`,
    ` */`,
    `const ${entry.componentName}: ComponentType<${entry.componentName}Props> = forwardRef<SVGSVGElement, ${entry.componentName}Props>((`,
    `  { fill, stroke, size, width, height, ...props },`,
    `  ref`,
    `) => {`,
    `  const finalFill = fill ?? 'currentColor';`,
    `  const finalStroke = stroke ?? 'currentColor';`,
    `  const dimension = size !== undefined ? (typeof size === 'number' ? \`\${size}px\` : size) : undefined;`,
    `  const finalWidth = width ?? dimension;`,
    `  const finalHeight = height ?? dimension;`,
    `  return (`,
    `    <SvgComponent`,
    `      id={props.id ?? undefined}`,
    `      fill={finalFill}`,
    `      stroke={finalStroke}`,
    `      width={finalWidth}`,
    `      height={finalHeight}`,
    `      ref={ref}`,
    `      {...props}`,
    `    />`,
    `  );`,
    `});`,
    '',
    `${entry.componentName}.displayName = '${entry.componentName}';`,
    '',
    `export default ${entry.componentName};`,
    '',
  ].join('\n');
}

/** Builds the icons/index.ts barrel re-exporting every generated component under its PascalCase name. */
function buildIconsBarrel(entries: IconEntry[]) {
  const lines = [header];
  for (const entry of entries) {
    lines.push(`export { default as ${entry.componentName} } from '@/icons/${entry.baseName}';`);
  }
  lines.push('');
  return lines.join('\n');
}

/** Builds icon-types.ts: the flat list of icon names, the `IconName` union, and the dynamic-import map types. */
function buildTypesFile(entries: IconEntry[]) {
  const names = entries.map(entry => entry.baseName);

  const lines: string[] = [
    header,
    "import type { ComponentType, SVGProps } from 'react';",
    '',
    `export const iconNames = [${names.map(name => `'${name}'`).join(', ')}] as const;\n`,
    'export type IconName = typeof iconNames[number];\n',
    'export type IconModule = Promise<{ default: ComponentType<SVGProps<SVGSVGElement>> }>;\n',
    'export type DynamicIconImport = () => IconModule;\n',
    'export type DynamicIconImportMap = Record<IconName, DynamicIconImport>;\n',
  ];

  return lines.join('\n');
}

/** Builds dynamicIconImports.ts mapping each icon name to a lazy import of its own bundled module. */
function buildDynamicIconImportsFile(entries: IconEntry[]) {
  const lines: string[] = [
    header,
    "import type { DynamicIconImportMap } from '@/icon-types';",
    '',
    '// Resolve each icon from its own bundled module so consumers need',
    '// neither @hackernoon/pixel-icon-library nor an SVG loader at runtime.',
    'const dynamicIconImports = {',
  ];

  entries.forEach(entry => {
    lines.push(`  '${entry.baseName}': () => import('@/icons/${entry.baseName}'),`);
  });

  lines.push('} as DynamicIconImportMap;');
  lines.push('');
  lines.push('export default dynamicIconImports;');
  lines.push('');

  return lines.join('\n');
}

/** Validates the dependency, reads every variant, then writes the per-icon modules, barrel, types, and dynamic-import map. */
async function generate() {
  const modulePath = await ensureDependencyDir();
  const iconsDir = path.join(process.cwd(), 'src', 'icons');
  const srcDir = path.join(process.cwd(), 'src');

  await cleanDir(iconsDir);

  const entries: IconEntry[] = [];

  for (const variant of variants) {
    const files = await readIcons(modulePath, variant);

    for (const file of files) {
      const baseName = file.replace(/\.svg$/i, '');
      const pascal = toPascalCase(baseName);
      // Component name is the bare PascalCase base, with no "Icon" suffix (e.g. ThumbsupSolid).
      const componentName = pascal;
      const importPath = `${dependencyName}/icons/SVG/${variant}/${file}`;

      const entry: IconEntry = { baseName, componentName, variant, importPath };
      entries.push(entry);

      const iconFilePath = path.join(iconsDir, `${baseName}.tsx`);
      const iconContent = buildIconFileContent(entry);
      await fs.writeFile(iconFilePath, iconContent, 'utf8');
    }
  }

  const barrelContent = buildIconsBarrel(entries);
  await fs.writeFile(path.join(iconsDir, 'index.ts'), barrelContent, 'utf8');

  const typesContent = buildTypesFile(entries);
  await fs.writeFile(path.join(srcDir, 'icon-types.ts'), typesContent, 'utf8');

  const dynamicImportsContent = buildDynamicIconImportsFile(entries);
  await fs.writeFile(path.join(srcDir, 'dynamicIconImports.ts'), dynamicImportsContent, 'utf8');

  console.log(`Generated ${entries.length} icon entrypoints under ${iconsDir}`);
  console.log('Generated icon-types.ts and dynamicIconImports.ts');
}

generate().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
