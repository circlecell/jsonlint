'use client';

import { useLayout } from './LayoutProvider';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Container({ children, className = '', padding = true }: ContainerProps) {
  const { width } = useLayout();

  const widthClass = width === 'fixed' ? 'max-w-7xl' : '';
  const paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`${widthClass} mx-auto ${paddingClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
