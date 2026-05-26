'use client';
import useTimer from "@/hooks/learning/useTimer";
import { decoupelimage, getChronoTime } from "@/lib/learning/functions";
import { Case, MatchInfo } from "@/lib/learning/interface";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import FinMatchView from "./FinMatchView";
import GameFormView from "./GameFormView";
import GamePlayView from "./GamePlayView";
import Loader from "./Loader";
import MenuGrid, { MenuItem } from "./MenuGrid";

const MenuDiambra = memo(() => {
    const router = useRouter();

    // États du jeu
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [view, setView] = useState<'menu' | 'form' | 'game'>('menu');
    const [loading, setLoading] = useState(false);

    // États des cases
    const [casesdujeuencours, setCasesdujeuencours] = useState<Case[]>([]);
    const [casesinitiales, setCasesinitiales] = useState<Case[]>([]);
    const [pieces, setPieces] = useState<string[]>([]);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);

    // États temporels
    const [datedebut, setDatedebut] = useState<string>("");
    const [start, setStart] = useState(false);

    // États de contrôle
    const [finmatch, setFinmatch] = useState(false);
    const [showPun, setShowPun] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(true);
    const [animated, setAnimated] = useState(true);

    // États de configuration
  //  const [nom, setNom] = useState("");
    const [niveau, setNiveau] = useState(2);
    const [option, setOption] = useState(0);

    // États des matchs
    const [matchEnCours, setMatchEnCours] = useState(-1);
    const [infomatch, setInfomatch] = useState<MatchInfo[]>([]);

    // Ref pour éviter les doubles chargements
    const isLoadingMatch = useRef(false);

    /**
     * 🔒 LOGIQUE FINALE PAR INDEX
     * Pour chaque case, on récupère son index et on compare :
     * casesdujeuencours[index].txt === casesinitiales[index].txt
     * Si égal → verrouiller
     */
    const swapCases = useCallback((c1: Case, c2: Case) => {
        if (!c1 || !c2 || casesinitiales.length === 0) return;

        const index1 = casesdujeuencours.findIndex(c => c.id === c1.id);
        const index2 = casesdujeuencours.findIndex(c => c.id === c2.id);

        if (index1 === -1 || index2 === -1) return;

        // Validation des indices
        if (index1 >= casesinitiales.length || index2 >= casesinitiales.length) {
            console.warn("Indices hors limites pour casesinitiales");
            return;
        }

        setCasesdujeuencours((prevCases) =>
            prevCases.map((c, index) => {
                // Case à index1 reçoit le texte de c2
                if (index === index1) {
                    const newTxt = c2.txt;
                    // ✅ Compare avec casesinitiales à l'index correspondant
                    const shouldLock = casesinitiales[index]?.txt === newTxt;
                    return {
                        ...c,
                        txt: newTxt,
                        isLocked: shouldLock,
                        isSelected: false
                    };
                }

                // Case à index2 reçoit le texte de c1
                if (index === index2) {
                    const newTxt = c1.txt;
                    // ✅ Compare avec casesinitiales à l'index correspondant
                    const shouldLock = casesinitiales[index]?.txt === newTxt;
                    return {
                        ...c,
                        txt: newTxt,
                        isLocked: shouldLock,
                        isSelected: false
                    };
                }

                return c;
            })
        );

        // Échange des pièces d'image
        setPieces((prevPieces) => {
            if (index1 >= prevPieces.length || index2 >= prevPieces.length) {
                return prevPieces;
            }

            const newPieces = [...prevPieces];
            [newPieces[index1], newPieces[index2]] = [newPieces[index2], newPieces[index1]];
            return newPieces;
        });
    }, [casesdujeuencours, casesinitiales]);

    /**
     * Sélection et échange de cases
     */
    const selectCase = useCallback((c: Case | null) => {
        if (!c || c.isLocked) {
            setSelectedCase(null);
            return;
        }

        if (!selectedCase) {
            setSelectedCase(c);
            return;
        }

        swapCases(selectedCase, c);
        setSelectedCase(null);
    }, [selectedCase, swapCases]);

    /**
     * 🔒 Verrouillage manuel par index
     * Récupère l'index de la case et compare avec casesinitiales[index]
     */
    const lockSelectedCase = useCallback(() => {
        if (!selectedCase || casesinitiales.length === 0) {
            setSelectedCase(null);
            return;
        }

        // Trouver l'index de la case dans casesdujeuencours
        const index = casesdujeuencours.findIndex(c => c.id === selectedCase.id);

        if (index === -1 || index >= casesinitiales.length) {
            setSelectedCase(null);
            return;
        }

        // ✅ Comparer avec casesinitiales à l'index correspondant
        const isCorrect = selectedCase.txt === casesinitiales[index]?.txt;

        if (!isCorrect) {
            // Ne pas verrouiller si incorrect
            setSelectedCase(null);
            return;
        }

        // Verrouiller la case
        setCasesdujeuencours((prevCases) =>
            prevCases.map((c) =>
                c.id === selectedCase.id
                    ? { ...c, isLocked: true, isSelected: false }
                    : c
            )
        );
        setSelectedCase(null);
    }, [selectedCase, casesdujeuencours, casesinitiales]);

    /**
     * Mélange les cases non verrouillées (algorithme Fisher-Yates partiel)
     */
    const shuffleUnlockedCases = useCallback(() => {
        setCasesdujeuencours((prevCases) => {
            const shuffled = [...prevCases];

            for (let i = shuffled.length - 1; i > 0; i--) {
                if (shuffled[i].isLocked) continue;

                // Trouver un index non verrouillé aléatoire
                let j = Math.floor(Math.random() * (i + 1));
                let attempts = 0;
                while (shuffled[j].isLocked && attempts < shuffled.length) {
                    j = Math.floor(Math.random() * (i + 1));
                    attempts++;
                }

                // Échanger si trouvé
                if (!shuffled[j].isLocked && i !== j) {
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
            }

            return shuffled;
        });
    }, []);

    /**
     * Toggle entre affichage puzzle et solution
     */
    const toggleShowPun = useCallback(() => {
        setShowPun((prev) => !prev);
        if (!showPun) {
            shuffleUnlockedCases();
        }
        setSelectedCase(null);
    }, [showPun, shuffleUnlockedCases]);

    /**
     * Gestion des clics sur les items du menu
     */
    const handleItemClick = useCallback((item: MenuItem) => {
        if (item.tpsglobal === -1) {
            router.push('/aide');
        } else {
            setSelectedItem(item);
            setView('form');
        }
    }, [router]);

    /**
     * Retour au menu principal
     */
    const handleBack = useCallback(() => {
        setSelectedItem(null);
        setView('menu');
        setFinmatch(false);
        setMatchEnCours(-1);
        setInfomatch([]);
        setCasesdujeuencours([]);
        setCasesinitiales([]);
        setPieces([]);
    }, []);

    /**
     * Charge les données d'un match spécifique
     */
    const chargerMatch = useCallback((matchData: MatchInfo) => {
        if (!matchData) return;

        const casesJeu = matchData.listeCaseOpLab ?? [];
        const casesInit = matchData.listeCaseOpLabInitiale ?? [];
        const piecesMatch = matchData.pieces ?? [];

        setCasesdujeuencours(casesJeu);
        setCasesinitiales(casesInit);
        setPieces(piecesMatch);
        setFinmatch(false);
        setSelectedCase(null);
        setShowPun(false);
    }, []);

    /**
     * 🚀 Lancement du jeu avec gestion correcte de l'état asynchrone
     */
    const lancerJeu = useCallback(async () => {
        try {
            setLoading(true);
            setStart(false);
            setFinmatch(false);

            const pieces = await decoupelimage("/ephotoquatorze.jpg", niveau);
            const response = await fetch("/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tpsglobal: selectedItem?.tpsglobal,
                    niveau,
                    pieces
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur API : ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success || !result.data?.matches) {
                throw new Error("Données de match invalides");
            }

            const matches = result.data.matches;

            // Validation des données reçues
            if (!Array.isArray(matches) || matches.length === 0) {
                throw new Error("Aucun match reçu de l'API");
            }

            // Charger les données
            setInfomatch(matches);
            setDatedebut(new Date().toISOString());
            setMatchEnCours(0);
            setAnimated(true);

            // Charger le premier match
            if (matches[0]) {
                chargerMatch(matches[0]);
            }

            setView('game');

        } catch (error) {
            console.error("Erreur lors du lancement du jeu :", error);
            alert(`Impossible de démarrer le jeu : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        } finally {
            setLoading(false);
        }
    }, [niveau, selectedItem?.tpsglobal, chargerMatch]);

    const timeElapsed = useTimer(start);

    // ==================== EFFECTS ====================

    /**
     * Démarre le timer après l'animation
     */
    useEffect(() => {
        if (hasAnimated && !start) {
            setStart(true);
        }
    }, [hasAnimated, start]);

    /**
     * Gestion du mode automatique (toggle periodique)
     */
    useEffect(() => {
        if (option === 0 || finmatch) return;

        const delay = showPun ? 5000 : getChronoTime(niveau);
        const timeout = setTimeout(() => {
            toggleShowPun();
        }, delay);

        return () => clearTimeout(timeout);
    }, [niveau, showPun, toggleShowPun, option, finmatch]);

    /**
     * 🔄 Chargement du match actuel
     */
    useEffect(() => {
        if (matchEnCours === -1 || !infomatch[matchEnCours] || isLoadingMatch.current) {
            return;
        }

        isLoadingMatch.current = true;
        chargerMatch(infomatch[matchEnCours]);

        // Reset du flag après un court délai
        setTimeout(() => {
            isLoadingMatch.current = false;
        }, 100);

    }, [matchEnCours, infomatch, chargerMatch]);

    /**
     * Détection de fin de tous les matchs
     */
    useEffect(() => {
        if (matchEnCours === -1 || !infomatch.length) return;

        // Tous les matchs sont terminés
        if (matchEnCours >= infomatch.length) {
            setFinmatch(true);
        }
    }, [matchEnCours, infomatch.length]);

    /**
     * 🎯 Détection de fin de match actuel
     */
    useEffect(() => {
        if (casesdujeuencours.length === 0) return;

        const allLocked = casesdujeuencours.every((c) => c.isLocked);

        if (allLocked) {
            // Match actuel terminé
            if (infomatch.length === 1 || matchEnCours >= infomatch.length - 1) {
                // Dernier match
                setFinmatch(true);
            } else {
                // Passer au match suivant
                setTimeout(() => {
                    setMatchEnCours((prev) => prev + 1);
                }, 500); // Petit délai pour l'animation
            }
        }
    }, [casesdujeuencours, infomatch.length, matchEnCours]);

    // ==================== RENDER ====================

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
            {view === 'menu' ? (
                <MenuGrid onItemClick={handleItemClick} />
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <button
                        onClick={handleBack}
                        className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg 
                                   hover:bg-gray-50 transition-colors flex items-center gap-2 
                                   shadow-sm font-medium text-gray-700"
                    >
                        ← Retour au menu
                    </button>

                    {view === 'form' ? (
                        <GameFormView
                            selectedGameType={selectedItem?.tpsglobal ?? 0}
                            niveau={niveau}
                            setNiveau={setNiveau}
                            option={option}
                            setOption={setOption}
                            lancerJeu={lancerJeu}
                        />
                    ) : (
                        <AnimatePresence mode="wait">
                            {finmatch ? (
                                <FinMatchView
                                    niveau={niveau}
                                    option={option}
                                    datedebut={datedebut}
                                    tpsglobal={selectedItem?.tpsglobal ?? 0}
                                    infomatch={infomatch}
                                />
                            ) : (
                                <GamePlayView
                                    cases={casesdujeuencours}
                                    casesun={casesinitiales}
                                    pieces={pieces}
                                    selectedCase={selectedCase}
                                    selectCase={selectCase}
                                    showPun={showPun}
                                    toggleShowPun={toggleShowPun}
                                    lockSelectedCase={lockSelectedCase}
                                    animated={animated}
                                    hasAnimated={hasAnimated}
                                    handleAnimationEnd={() => {
                                        if (!hasAnimated) setHasAnimated(true);
                                    }}
                                    start={start}
                                    timeElapsed={timeElapsed}
                                    niveau={niveau}
                                    option={option}
                                    matchEncours={matchEnCours}
                                    infomatch={infomatch}
                                    tpsglobal={selectedItem?.tpsglobal ?? 0}
                                />
                            )}
                        </AnimatePresence>
                    )}
                </motion.div>
            )}
        </div>
    );
});

MenuDiambra.displayName = "MenuDiambra";

export default MenuDiambra;
