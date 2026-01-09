import { ComponentType, SVGProps, Suspense, lazy, useMemo } from 'react';
import type { IconName, IconVariant } from './index';

interface DynamicPixelIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: IconName;
  variant?: IconVariant;
  size?: number;
  fallback?: React.ReactNode;
}

/**
 * DynamicPixelIcon - Lazy-loads icons at runtime for better code-splitting
 * 
 * Usage:
 * ```tsx
 * <DynamicPixelIcon name="heart" size={24} />
 * <DynamicPixelIcon name="star-solid" />
 * ```
 */
export const DynamicPixelIcon = ({
  name,
  variant,
  size = 24,
  fallback = null,
  ...props
}: DynamicPixelIconProps) => {
  const LazyIcon = useMemo(() => {
    // Determine actual variant to use
    const actualVariant = variant || (name.endsWith('-solid') ? 'solid' : 'regular');
    const cleanName = name.replace('-solid', '');

    // Dynamically import the icon based on name
    try {
      return lazy(() =>
        import(`@hackernoon/pixel-icon-library/icons/SVG/${actualVariant}/${cleanName}.svg?react`)
          .then((module) => ({ default: module.default as ComponentType<SVGProps<SVGSVGElement>> }))
          .catch(() => {
            // Fallback if icon not found
            return { default: () => <svg width={size} height={size} /> };
          })
      );
    } catch {
      // Return empty SVG if import fails
      return () => <svg width={size} height={size} />;
    }
  }, [name, variant, size]);

  return (
    <Suspense fallback={fallback || <svg width={size} height={size} />}>
      <LazyIcon {...props} width={size} height={size} />
    </Suspense>
  );
};

export default DynamicPixelIcon;
