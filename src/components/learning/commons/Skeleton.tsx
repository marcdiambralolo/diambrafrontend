'use client';
import { memo, useMemo, CSSProperties, useEffect, useState } from 'react';

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  animate?: boolean;
  variant?: 'default' | 'card' | 'avatar' | 'text' | 'button';
  count?: number;
  inline?: boolean;
  gap?: string;
}

const ROUNDED_MAP = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
} as const;

const VARIANT_STYLES = {
  default: 'bg-gray-100 dark:bg-gray-800',
  card: 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800',
  text: 'bg-gray-100 dark:bg-gray-800 h-4',
  avatar: 'rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600',
  button: 'bg-gray-200 dark:bg-gray-700 rounded-lg'
} as const;

const BaseSkeleton = memo(({
  height,
  width,
  rounded = 'xl',
  className = '',
  animate = true,
  variant = 'default',
  style = {}
}: SkeletonProps & { style?: CSSProperties }) => {
  // Mémorisation des classes combinées
  const combinedClasses = useMemo(() => {
    const variantClass = VARIANT_STYLES[variant];
    const roundedClass = ROUNDED_MAP[rounded];
    const animationClass = animate ? 'animate-pulse' : '';

    // Conversion de la hauteur/largeur si nécessaire
    const heightClass = height ? (typeof height === 'number' ? `h-[${height}px]` : height) : '';
    const widthClass = width ? (typeof width === 'number' ? `w-[${width}px]` : width) : '';

    return [
      variantClass,
      roundedClass,
      animationClass,
      heightClass,
      widthClass,
      className
    ].filter(Boolean).join(' ');
  }, [variant, rounded, animate, height, width, className]);

  // Mémorisation du style inline
  const inlineStyle = useMemo(() => {
    const styles: CSSProperties = { ...style };
    if (height && typeof height === 'number') styles.height = height;
    if (width && typeof width === 'number') styles.width = width;
    return styles;
  }, [height, width, style]);

  return (
    <div
      className={combinedClasses}
      style={inlineStyle}
      aria-hidden="true"
      role="presentation"
    />
  );
});

BaseSkeleton.displayName = 'BaseSkeleton';

export const TextSkeleton = memo(({ lines = 1, lastLineWidth = 'w-3/4', gap = 'gap-2' }: {
  lines?: number;
  lastLineWidth?: string;
  gap?: string;
}) => {
  const linesArray = useMemo(() =>
    Array.from({ length: lines }, (_, i) => i),
    [lines]
  );

  return (
    <div className={`flex flex-col ${gap}`} role="presentation" aria-label="Chargement du texte">
      {linesArray.map((index) => (
        <Skeleton
          key={index}
          height="h-4"
          width={index === lines - 1 && lines > 1 ? lastLineWidth : 'w-full'}
          variant="text"
          className={index === lines - 1 ? 'w-3/4' : ''}
        />
      ))}
    </div>
  );
});

TextSkeleton.displayName = 'TextSkeleton';

export const AvatarSkeleton = memo(({ size = 'w-12 h-12' }: { size?: string }) => (
  <Skeleton height={size} width={size} variant="avatar" rounded="full" />
));

AvatarSkeleton.displayName = 'AvatarSkeleton';

export const CardSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
    <div className="flex items-start gap-3">
      <AvatarSkeleton size="w-10 h-10" />
      <div className="flex-1">
        <TextSkeleton lines={2} lastLineWidth="w-1/2" />
      </div>
    </div>
    <div className="mt-3">
      <Skeleton height="h-20" variant="card" />
    </div>
    <div className="mt-3 flex gap-2">
      <Skeleton height="h-8" width="w-20" variant="button" />
      <Skeleton height="h-8" width="w-20" variant="button" />
    </div>
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';

export const ListSkeleton = memo(({ items = 5, itemHeight = 'h-16', gap = 'gap-3' }: {
  items?: number;
  itemHeight?: string;
  gap?: string;
}) => {
  const itemsArray = useMemo(() => Array.from({ length: items }, (_, i) => i), [items]);

  return (
    <div className={`flex flex-col ${gap}`} role="presentation" aria-label={`Chargement de ${items} éléments`}>
      {itemsArray.map((index) => (
        <Skeleton key={index} height={itemHeight} variant="default" />
      ))}
    </div>
  );
});

ListSkeleton.displayName = 'ListSkeleton';

export const GridSkeleton = memo(({
  cols = 2,
  rows = 3,
  itemHeight = 'h-32',
  gap = 'gap-4'
}: {
  cols?: number;
  rows?: number;
  itemHeight?: string;
  gap?: string;
}) => {
  const totalItems = cols * rows;
  const gridCols = `grid-cols-${cols}`;

  // Utilisation de CSS Grid personnalisé pour les colonnes
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: gap.replace('gap-', '')
  }), [cols, gap]);

  return (
    <div
      style={gridStyle}
      className={`w-full ${gap}`}
      role="presentation"
      aria-label={`Chargement de ${totalItems} éléments`}
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <Skeleton key={index} height={itemHeight} variant="card" />
      ))}
    </div>
  );
});

GridSkeleton.displayName = 'GridSkeleton';

export const TableSkeleton = memo(({
  rows = 5,
  cols = 4,
  headerHeight = 'h-12',
  rowHeight = 'h-10'
}: {
  rows?: number;
  cols?: number;
  headerHeight?: string;
  rowHeight?: string;
}) => (
  <div className="w-full" role="presentation" aria-label="Chargement du tableau">
    <div className="flex gap-2 mb-2">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={`header-${i}`} height={headerHeight} width="flex-1" variant="button" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-2 mb-2">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton
            key={`cell-${rowIndex}-${colIndex}`}
            height={rowHeight}
            width="flex-1"
            variant={colIndex === 0 ? 'avatar' : 'default'}
          />
        ))}
      </div>
    ))}
  </div>
));

TableSkeleton.displayName = 'TableSkeleton';

export const Skeleton = memo(({
  height = 'h-4',
  width,
  rounded = 'xl',
  className = '',
  animate = true,
  variant = 'default',
  count = 1,
  gap = 'gap-2',
  inline = false
}: SkeletonProps) => {
  // Mémorisation des squelettes multiples
  const skeletons = useMemo(() =>
    Array.from({ length: count }, (_, index) => (
      <BaseSkeleton
        key={index}
        height={height}
        width={width}
        rounded={rounded}
        className={className}
        animate={animate}
        variant={variant}
      />
    )),
    [count, height, width, rounded, className, animate, variant]
  );

  if (count === 1) {
    return (
      <BaseSkeleton
        height={height}
        width={width}
        rounded={rounded}
        className={className}
        animate={animate}
        variant={variant}
      />
    );
  }

  return (
    <div
      className={`${inline ? 'inline-flex' : 'flex flex-col'} ${gap}`}
      role="presentation"
      aria-label={`Chargement de ${count} éléments`}
    >
      {skeletons}
    </div>
  );
});

Skeleton.displayName = 'Skeleton';

export const LazySkeleton = memo(({
  height = 'h-4',
  width,
  rounded = 'xl',
  delay = 0
}: SkeletonProps & { delay?: number }) => {
  const [showSkeleton, setShowSkeleton] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowSkeleton(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!showSkeleton) return null;

  return (
    <BaseSkeleton
      height={height}
      width={width}
      rounded={rounded}
      animate={true}
    />
  );
});

export const withSkeleton = <P extends object>(
  Component: React.ComponentType<P>,
  skeletonProps: SkeletonProps = {}
) => {
  const WithSkeleton = memo(({ isLoading, ...props }: P & { isLoading?: boolean }) => {
    if (isLoading) {
      return <Skeleton {...skeletonProps} />;
    }
    return <Component {...(props as P)} />;
  });

  WithSkeleton.displayName = `WithSkeleton(${Component.displayName || Component.name})`;
  return WithSkeleton;
};

export const useSkeletonDelay = (delay: number = 300) => {

  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return showSkeleton;
};

export default Skeleton;