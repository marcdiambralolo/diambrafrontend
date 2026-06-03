'use client';
import Loader from "@/app/loading";
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import { useAdminConsultationsPageFinished } from "@/hooks/learning/lacompetition/useAdminConsultationsPageFinished";
import { formatDateFRJeu } from "@/lib/functions";
import { ValidationMessage } from "@/lib/learning/interface";
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import TheGame from "../game/TheGame";
import HelpPanel from "../help/HelpPanel";
import Historique from "../historique/Historique";
import LaBanniere from "../labanniere/LaBanniere";
import LaMise from "../mise/LaMise";
import { CompetitionDetails, FooterSection, HeaderSection, HelpButton, MessageToast, RestartButton } from "./Banana";
import { ActiveBanner, EndedBanner, NotStartedBanner } from "./Features";

function BanniereCompetition() {
    const {
        demarrerJeu, handleOpenGame,
        startDate, gameConfig, viewState, loading, lastEndedGame, endDate,
    } = useAdminConsultationsPageFinished();

    const {
        handleValidateCompetition, handleRestart,
        hasCompetitions, isValidating, isSubmitting, competitions, validateMessage,
    } = useEndGameGenerator();

    const afficheaide = useMonEtoileStore((state) => state.afficheaide);
    const lejeu = useMonEtoileStore((state) => state.lejeu);
    const lamise = useMonEtoileStore((state) => state.lamise);
    const jeuenattente = useMonEtoileStore((state) => state.jeuenattente);
    const afficherJeu = useMonEtoileStore((state) => state.afficherJeu);

    const [globalMessage, setGlobalMessage] = useState<ValidationMessage | null>(null);

    useEffect(() => {
        setGlobalMessage(validateMessage);
    }, [validateMessage]);

    const handleCloseGlobalMessage = useCallback(() => setGlobalMessage(null), []);
    const handleCloseHelp = useCallback(() => afficherJeu(), [afficherJeu]);

    const competitionList = useMemo(() =>
        competitions.map((competition) => (
            <CompetitionDetails
                key={competition.id}
                competition={competition}
                onValidate={handleValidateCompetition}
            />
        )),
        [competitions, handleValidateCompetition]
    );

    if (loading) return <Loader />;

    return (
        <div className="w-full mx-auto max-w-md">
            <div className="flex flex-col items-center justify-center mb-8">
                <MessageToast message={globalMessage} onClose={handleCloseGlobalMessage} />
                <HeaderSection />

                {afficheaide && <HelpPanel onClose={handleCloseHelp} />}
                {lamise && <LaMise />}
                {lejeu && <TheGame />}

                {jeuenattente && (
                    <>
                        {viewState.isEnded && <EndedBanner lastEndedGame={lastEndedGame} />}
                        {viewState.isNotStarted && (
                            <NotStartedBanner startDate={startDate!} handleOpenGame={handleOpenGame} />
                        )}
                        {viewState.isActive && (
                            <ActiveBanner
                                endDate={endDate!}
                                startDate={startDate!}
                                formatDate={formatDateFRJeu}
                                gameConfig={gameConfig}
                                demarrerJeu={demarrerJeu}
                            />
                        )}
                    </>
                )}

                {hasCompetitions && (
                    <>
                        <RestartButton onClick={handleRestart} disabled={isValidating || isSubmitting} />
                        {competitionList}
                    </>
                )}

                <LaBanniere />
                <Historique />
                <FooterSection />
                <HelpButton />
            </div>
        </div>
    );
}

export default memo(BanniereCompetition);