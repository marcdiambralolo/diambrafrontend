'use client';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { FooterSection } from "../commons/Features";
import HeaderSection from "./HeaderSection";
import HelpPanel from "./HelpPanel";

const HelpPage = () => {
  const router = useRouter();

  const handleCloseHelp = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="container mx-auto max-w-md">
      <HeaderSection />
      <HelpPanel onClose={handleCloseHelp} />
      <div className="mt-4">
        <FooterSection />
      </div>
    </div>
  );
};

export default memo(HelpPage);