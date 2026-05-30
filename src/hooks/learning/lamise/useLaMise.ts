import { getCategoryErrorMessage } from '@/hooks/categorie/categoryConsultation.shared';
import { walletService } from '@/lib/api/services/wallet.service';
import type { OfferingAlternative, WalletOffering } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameConfig } from '../useGame';
import { useMonEtoileStore } from '@/lib/store/monetoile.store';

const POT_CONFIG: OfferingAlternative = {
    offeringId: '6945ae01b8af14d5f56cec09',
    quantity: 1,
    name: 'JETON DIAMBRA',
    price: 200,
    createdAt: '',
    updatedAt: '',
    _id: '69ada22a910a174365e2a216',
} as const;

const BASE_CLASSES = "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group";
const INSUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed";
const SUFFICIENT_CLASSES = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9BC2FF] hover:shadow-xl hover:shadow-[#4F83D1]/10 active:scale-[0.98] cursor-pointer";

interface WalletState {
    loading: boolean;
    error: string | null;
    showError: boolean;
    walletOfferings: WalletOffering[];
}

const getOfferingId = (alternative: OfferingAlternative): string => {
    const offeringId = alternative.offeringId;
    if (offeringId && typeof offeringId === 'object' && '_id' in offeringId) {
        return (offeringId as { _id: string })._id;
    }
    return offeringId as string;
};

const initialState: WalletState = {
    loading: true,
    error: null,
    showError: false,
    walletOfferings: [],
};

export function useLaMise() {
    const router = useRouter();
    const { data: gameConfig, isLoading: configLoading } = useGameConfig();
    const { setJouer, setGameStarted } = useMonEtoileStore();

    const isMountedRef = useRef(true);
    const timerRef = useRef<NodeJS.Timeout>();

    const [walletState, setWalletState] = useState<WalletState>(initialState);
    const monidjeu = useMemo(() => gameConfig?._id || gameConfig?.id || "", [gameConfig]);

    const walletMap = useMemo(() => {
        const map = new Map<string, number>();
        walletState.walletOfferings.forEach(w => map.set(w.offeringId, w.quantity));
        return map;
    }, [walletState.walletOfferings]);

    const availableQuantity = useMemo(() =>
        walletMap.get(getOfferingId(POT_CONFIG)) || 0,
        [walletMap]
    );

    const isSufficient = useMemo(() =>
        availableQuantity >= POT_CONFIG.quantity,
        [availableQuantity]
    );

    const cardClasses = useMemo(() =>
        `${BASE_CLASSES} ${isSufficient ? SUFFICIENT_CLASSES : INSUFFICIENT_CLASSES}`,
        [isSufficient]
    );

    const isLoading = configLoading || walletState.loading;

    const handleValidation = useCallback(() => {
        setGameStarted(true);
        setJouer(true);
    }, [setGameStarted, setJouer]);

    const handleNext = useCallback(() => {
        if (isSufficient && !isLoading) {
            handleValidation();
        }
    }, [isSufficient, isLoading, handleValidation]);

    const handleGoToMarket = useCallback(() => {
        router.push(`/star/marcheoffrandes?retour=learning&monjeu=${monidjeu}`);
    }, [router, monidjeu]);

    useEffect(() => {
        isMountedRef.current = true;

        const loadWalletOfferings = async () => {
            try {
                const walletRes = await walletService.getUnusedWalletOfferings();
                if (isMountedRef.current) {
                    setWalletState(prev => ({ ...prev, walletOfferings: walletRes, loading: false }));
                }
            } catch (err) {
                console.error('Erreur chargement wallet:', err);
                if (isMountedRef.current) {
                    setWalletState(prev => ({
                        ...prev,
                        error: getCategoryErrorMessage(err, 'Erreur lors du chargement'),
                        showError: true,
                        loading: false,
                    }));
                }
            }
        };

        loadWalletOfferings();

        return () => {
            isMountedRef.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return {
        requiredQuantity: POT_CONFIG.quantity, loading: isLoading,
        handleGoToMarket, handleNext, availableQuantity, cardClasses, isSufficient,
    };
}