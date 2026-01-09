import { promises as fs } from 'fs';
import path from 'path';

const dependencyName = '@hackernoon/pixel-icon-library';
const svgRoot = ['icons', 'SVG'];
const variants = ['regular', 'solid'] as const;

const header = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Run "npm run generate" to regenerate from @hackernoon/pixel-icon-library.
`;

const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

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

async function generate() {
  const modulePath = await ensureDependencyDir();

  const importLines: string[] = [];
  const registryLines: string[] = [];
  const exportNames: string[] = [];
  const regularNames: string[] = [];
  const solidNames: string[] = [];

  for (const variant of variants) {
    const files = await readIcons(modulePath, variant);
    registryLines.push(`export const ${variant}Icons = {`);

    for (const file of files) {
      const baseName = file.replace(/\.svg$/i, '');
      const pascal = toPascalCase(baseName.replace(/-solid$/i, ''));
      const componentName = `${pascal}${variant === 'solid' ? 'Solid' : 'Regular'}Icon`;
      const importPath = `${dependencyName}/icons/SVG/${variant}/${file}`;

      importLines.push(`import ${componentName} from '${importPath}';`);
      registryLines.push(`  '${baseName}': ${componentName},`);
      exportNames.push(componentName);

      if (variant === 'regular') {
        regularNames.push(baseName);
      } else {
        solidNames.push(baseName);
      }
    }

    registryLines.push(
      `} as const satisfies Record<${variant === 'regular' ? 'RegularIconName' : 'SolidIconName'}, IconComponent>;\n`
    );
  }

  const content = [
    header,
    "import type { ComponentType, SVGProps } from 'react';",
    ...importLines,
    '',
    'type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;\n',
    `export type RegularIconName = ${regularNames.map((name) => `'${name}'`).join(' | ')};`,
    `export type SolidIconName = ${solidNames.map((name) => `'${name}'`).join(' | ')};`,
    'export type IconName = RegularIconName | SolidIconName;',
    "export type IconVariant = 'regular' | 'solid';\n",
    ...registryLines,
    'export const iconRegistry = { regular: regularIcons, solid: solidIcons } as const;',
    'export type IconRegistry = typeof iconRegistry;\n',
    `export { ${exportNames.join(', ')} };`,
    '',
  ].join('\n');

  const outputPath = path.join(process.cwd(), 'src', 'generated', 'icons.ts');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`Generated ${outputPath}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
