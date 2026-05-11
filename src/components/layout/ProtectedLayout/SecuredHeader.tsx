'use client';
import { memo } from 'react';

interface SecuredHeaderProps {
  children: React.ReactNode;
}

const SecuredHeader = memo<SecuredHeaderProps>(({ children }) => {
  
  return (
    <div className="theme-dark-panel sticky top-0 z-50 border-b border-[var(--accent-violet)]/40 dark:border-[var(--accent-gold)]/40 bg-[var(--bg-light)]/80 dark:bg-[var(--bg-dark)]/86 backdrop-blur mb-8">
      <div className="pt-[env(safe-area-inset-top)]" />      
      {children}
    </div>
  );
});

SecuredHeader.displayName = 'SecuredHeader';

export default SecuredHeader;