import { promises as fs } from 'fs';
import path from 'path';

const dependencyName = '@hackernoon/pixel-icon-library';
const svgRoot = ['icons', 'SVG'];
const variants = ['brands', 'purcats', 'regular', 'solid'] as const;

const header = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Run "npm run generate" to regenerate from @hackernoon/pixel-icon-library.
`;

const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

type IconEntry = {
  baseName: string;
  componentName: string;
  variant: (typeof variants)[number];
  importPath: string;
};

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

async function readIcons(modulePath: string, variant: (typeof variants)[number]) {
  const iconDir = path.join(modulePath, ...svgRoot, variant);
  const entries = await fs.readdir(iconDir);
  return entries
    .filter((file: string) => file.toLowerCase().endsWith('.svg'))
    .sort((a: string, b: string) => a.localeCompare(b));
}

async function cleanDir(dir: string) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

function buildIconFileContent(entry: IconEntry) {
  return [
    header,
    '/// <reference path="../types/upstream-svg.d.ts" />',
    `import { forwardRef } from 'react';`,
    `import type { ComponentType, SVGProps } from 'react';`,
    `import SvgComponent from '${entry.importPath}';`,
    '',
    `/**`,
    ` * @component`,
    ` * @name ${entry.componentName}`,
    ` * @description Pixel icon component from @hackernoon/pixel-icon-library`,
    ` * @param props - SVG element props (supports className for styling with text-white, text-black, etc.)`,
    ` * @returns JSX Element`,
    ` */`,
    `const ${entry.componentName}: ComponentType<SVGProps<SVGSVGElement>> = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => {`,
    `  return (`,
    `    <SvgComponent`,
    `      {...props}`,
    `      ref={ref}`,
    `      style={{`,
    `        ...props.style,`,
    `        color: 'inherit',`,
    `      }}`,
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

function buildIconsBarrel(entries: IconEntry[]) {
  const lines = [header];
  for (const entry of entries) {
    lines.push(`export { default as ${entry.componentName} } from './${entry.baseName}';`);
  }
  lines.push('');
  return lines.join('\n');
}

function buildTypesFile(entries: IconEntry[]) {
  const brandsNames = entries
    .filter((entry) => entry.variant === 'brands')
    .map((entry) => entry.baseName);
  const purcatsNames = entries
    .filter((entry) => entry.variant === 'purcats')
    .map((entry) => entry.baseName);
  const regularNames = entries
    .filter((entry) => entry.variant === 'regular')
    .map((entry) => entry.baseName);
  const solidNames = entries
    .filter((entry) => entry.variant === 'solid')
    .map((entry) => entry.baseName);

  const lines: string[] = [
    header,
    "import type { ComponentType, SVGProps } from 'react';",
    '',
    `export const brandsIconNames = [${brandsNames
      .map((name) => `'${name}'`)
      .join(', ')}] as const;`,
    `export const purcatsIconNames = [${purcatsNames
      .map((name) => `'${name}'`)
      .join(', ')}] as const;`,
    `export const regularIconNames = [${regularNames
      .map((name) => `'${name}'`)
      .join(', ')}] as const;`,
    `export const solidIconNames = [${solidNames
      .map((name) => `'${name}'`)
      .join(', ')}] as const;`,
    'export const iconNames = [...brandsIconNames, ...purcatsIconNames, ...regularIconNames, ...solidIconNames] as const;\n',
    'export type BrandsIconName = typeof brandsIconNames[number];',
    'export type PurcatsIconName = typeof purcatsIconNames[number];',
    'export type RegularIconName = typeof regularIconNames[number];',
    'export type SolidIconName = typeof solidIconNames[number];',
    'export type IconName = BrandsIconName | PurcatsIconName | RegularIconName | SolidIconName;',
    "export type IconVariant = 'brands' | 'purcats' | 'regular' | 'solid';\n",
    'export type IconModule = Promise<{ default: ComponentType<SVGProps<SVGSVGElement>> }>;\n',
    'export type DynamicIconImport = () => IconModule;\n',
    'export type DynamicIconImportMap = Record<IconName, DynamicIconImport>;\n',
  ];

  return lines.join('\n');
}

function buildDynamicIconImportsFile(entries: IconEntry[]) {
  const lines: string[] = [
    header,
    '/// <reference path="./types/upstream-svg.d.ts" />',
    "import type { DynamicIconImportMap, IconModule } from './icon-types';",
    '',
    '// @ts-ignore - Dynamic imports are resolved at runtime',
    'const loadIcon = (path: string): IconModule => import(path);',
    '',
    'const dynamicIconImports = {',
  ];

  entries.forEach((entry) => {
    lines.push(
      `  '${entry.baseName}': () => loadIcon('${entry.importPath}'),`
    );
  });

  lines.push('} as DynamicIconImportMap;');
  lines.push('');
  lines.push('export default dynamicIconImports;');
  lines.push('');

  return lines.join('\n');
}

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
      // Export component without the "Icon" suffix (e.g., ThumbsupSolid)
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

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
