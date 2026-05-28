import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from 'react';
import { useCommon } from "../useCommon";

const GAME_ROUTES = {
    LEARNING: '/star/learning',
    ENDGAME: '/star/learning/endgame',
    GAME_BASE: '/star/learning/game',
} as const;

export const useGameGenerator = () => {
    const router = useRouter();
    const { onlineStatus } = useCommon();
    const searchParams = useSearchParams();

    const tpsglobal = Number(searchParams.get('tpsglobal') || "0");

    const [niveau, setNiveau] = useState(2);

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const handleBack = useCallback(() => {
        router.push(GAME_ROUTES.LEARNING);
    }, [router]);

    const handleClick = useCallback(() => {
        window.location.href = GAME_ROUTES.LEARNING;
    }, []);

    const lancerJeu = useCallback(async () => {
        router.push(`/star/learning/game?niveau=${niveau}&tpsglobal=${tpsglobal}`);
    }, [niveau, router]);

    return {
        handleBack, handleClick, setNiveau, lancerJeu,
        currentYear, niveau, tpsglobal, onlineStatus,
    };
};