'use client';
import { choix, niveauOptions, optionOptions } from "@/lib/learning/functions";
import { motion } from "framer-motion";
import { memo } from "react";
import FormField from "./FormField";
import RadioButtonGroup from "./RadioButtonGroup";

interface GameFormViewProps {
    selectedGameType: number;
    niveau: number;
    setNiveau: (niveau: number) => void;
    option: number;
    setOption: (option: number) => void;
    lancerJeu: () => void;
}

const GameFormView = memo(({
    selectedGameType,
    niveau,
    setNiveau,
    option,
    setOption,
    lancerJeu
}: GameFormViewProps) => {
    return (
        <motion.div
            className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 w-full max-w-md backdrop-blur-md"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            aria-labelledby="game-form-title"
        >
            <p className="text-gray-700 text-center py-3 px-4 border border-gray-300 rounded-xl mb-5 font-semibold">
                🎮 Jeu sélectionné : {choix(selectedGameType)}
            </p>

            <FormField label="📊 Niveau">
                <fieldset className="flex flex-col gap-3" aria-labelledby="niveau-options">
                    <legend className="sr-only">Sélectionner un niveau</legend>
                    <RadioButtonGroup
                        options={niveauOptions.map((num) => ({ value: num, label: `${num}` }))}
                        selectedValue={niveau}
                        onChange={setNiveau}
                        name="niveau"
                    />
                </fieldset>
            </FormField>

            <FormField label="⚙️ Options">
                <fieldset className="flex flex-col gap-3" aria-labelledby="option-options">
                    <legend className="sr-only">Sélectionner une option</legend>
                    <RadioButtonGroup
                        options={optionOptions}
                        selectedValue={option}
                        onChange={setOption}
                        name="option"
                    />
                </fieldset>
            </FormField>

            <div className="mt-6 flex justify-center">
                <motion.button
                    className="bg-green-600 hover:bg-green-700 text-white text-lg font-medium px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={lancerJeu}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Démarrer le jeu"
                >
                    🚀 Démarrer le jeu
                </motion.button>
            </div>
        </motion.div>
    );
});

GameFormView.displayName = "GameFormView";

export default GameFormView;