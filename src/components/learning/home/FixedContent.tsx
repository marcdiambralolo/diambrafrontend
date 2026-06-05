'use client';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { FooterSection, HelpButton } from '../commons/Features';
import LaBanniere from './LaBanniere';
import Historique from '../historique/Historique';

 
interface FixedContentProps {
    showBanner: boolean;
}

const FixedContent = memo(({ showBanner }: FixedContentProps) => (
    <div className="fixed-bottom-content w-full space-y-4">
        <LaBanniere affichebanner={showBanner} />
        <Historique />

        <FooterSection />
        <HelpButton />
    </div>
));

export default FixedContent;