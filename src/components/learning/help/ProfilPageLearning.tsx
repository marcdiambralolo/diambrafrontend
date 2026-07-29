'use client';
import { useHelp } from '@/hooks/learning/help/useHelp';
import { memo } from 'react';
import { FooterSection } from "../commons/Features";
import HeaderSection from "./HeaderSection";
import HelpPanel from "./HelpPanel";

const HelpPage = () => {
  const { handleCloseHelp } = useHelp();

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