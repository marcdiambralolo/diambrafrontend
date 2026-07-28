'use client';
import { memo, useCallback, useMemo, useTransition } from 'react';
import BackButton from "./BackButton";
import { HELP_SECTIONS } from "./constant";
import HelpHeader from "./HelpHeader";
import HelpHeaderGradient from "./HelpHeaderGradient";
import { HelpSectionCard, type HelpSection } from './HelpSectionCard';
import { QuickTipsCard } from './QuickTipsCard';

const HelpPanel = memo(({ onClose }: { onClose: () => void }) => {
    const [isPending, startTransition] = useTransition();

    const handleClose = useCallback(() => {
        startTransition(() => {
            onClose();
        });
    }, [onClose]);

    const sections = useMemo(() =>
        HELP_SECTIONS.map((section, index) => (
            <HelpSectionCard
                key={section.id}
                section={section as HelpSection}
                priority={index < 3}
            />
        )),
        []
    );

    return (
        <div className="w-full max-w-md mx-auto mt-2 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <HelpHeaderGradient onClose={handleClose} />

                <div className="p-4 overflow-y-auto">
                    <BackButton onClick={handleClose} isPending={isPending} />
                    <HelpHeader />

                    <div className="space-y-4">
                        {sections}
                    </div>

                    <QuickTipsCard />
                </div>
            </div>
        </div>
    );
});

export default memo(HelpPanel);