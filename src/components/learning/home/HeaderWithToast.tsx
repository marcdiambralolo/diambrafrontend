'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useCallback } from 'react';
import { HeaderSection, MessageToast } from '../commons/Features';

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