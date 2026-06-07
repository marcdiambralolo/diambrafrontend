'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { HeaderSection, MessageToast } from '../commons/Features';
import { useCallback } from 'react';

const HeaderWithToast = () => {
    const { validateMessage, clearValidateMessage } = useEndGameGenerator();

    const handleCloseToast = useCallback(() => {
        clearValidateMessage();
    }, [clearValidateMessage]);
    return (
        <>
            {validateMessage && (
                <MessageToast
                    message={validateMessage}
                    onClose={handleCloseToast}
                />
            )}
            <HeaderSection />
        </>
    );
};

export default HeaderWithToast;