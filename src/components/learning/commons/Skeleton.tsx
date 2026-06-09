'use client';
import { CSSProperties, memo, useEffect, useMemo, useState } from 'react';

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

interface BaseSkeletonProps extends SkeletonProps {
  style?: CSSProperties;
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
  card: 'bg-gray-100 dark:bg-gray-800',
  text: 'bg-gray-100 dark:bg-gray-800 h-4',
  avatar: 'rounded-full bg-gray-200 dark:bg-gray-700',
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
}: BaseSkeletonProps) => {
  const combinedClasses = useMemo(() => {
    const variantClass = VARIANT_STYLES[variant];
    const roundedClass = ROUNDED_MAP[rounded];
    const animationClass = animate ? 'animate-pulse' : '';

    const getSizeClass = (value?: string | number) => {
      if (!value) return '';
      if (typeof value === 'number') return `h-[${value}px] w-[${value}px]`;
      return value;
    };

    const heightClass = getSizeClass(height);
    const widthClass = getSizeClass(width);

    return [
      variantClass,
      roundedClass,
      animationClass,
      heightClass,
      widthClass,
      className
    ].filter(Boolean).join(' ');
  }, [variant, rounded, animate, height, width, className]);

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

export const TextSkeleton = memo(({
  lines = 1,
  lastLineWidth = 'w-3/4',
  gap = 'gap-2'
}: {
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
        />
      ))}
    </div>
  );
});

export const AvatarSkeleton = memo(({ size = 'w-12 h-12' }: { size?: string }) => (
  <Skeleton height={size} width={size} variant="avatar" rounded="full" />
));

export const CardSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
    <div className="flex items-start gap-3">
      <AvatarSkeleton size="w-10 h-10" />
      <div className="flex-1">
        <TextSkeleton lines={2} />
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

export const ListSkeleton = memo(({
  items = 5,
  itemHeight = 'h-16',
  gap = 'gap-3'
}: {
  items?: number;
  itemHeight?: string;
  gap?: string;
}) => {
  const itemsArray = useMemo(() =>
    Array.from({ length: items }, (_, i) => i),
    [items]
  );

  return (
    <div className={`flex flex-col ${gap}`} role="presentation" aria-label={`Chargement de ${items} éléments`}>
      {itemsArray.map((index) => (
        <Skeleton key={index} height={itemHeight} variant="default" />
      ))}
    </div>
  );
});

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

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: gap.replace('gap-', '')
  }), [cols, gap]);

  return (
    <div
      style={gridStyle}
      className="w-full"
      role="presentation"
      aria-label={`Chargement de ${totalItems} éléments`}
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <Skeleton key={index} height={itemHeight} variant="card" />
      ))}
    </div>
  );
});

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

export const PageSkeleton = memo(() => (
  <div className="w-full mx-auto max-w-md pb-20 min-h-screen">
    <div className="flex flex-col items-center justify-center mb-8 space-y-4">
      <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
      <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
    </div>
  </div>
));

export const useSkeletonDelay = (delay: number = 300): boolean => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return showSkeleton;
};

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

export default Skeleton;