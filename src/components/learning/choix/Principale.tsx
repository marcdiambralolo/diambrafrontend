"use client";
import { useCommon } from "@/hooks/learning/useCommon";
import { choix, niveauOptions } from "@/lib/learning/functions";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, memo, useCallback, useMemo, useState } from "react";

interface RadioButtonGroupProps {
  options: { value: number; label: string; }[];
  selectedValue: number;
  onChange: (value: number) => void;
  name: string;
}

const RadioButtonGroup = memo(({ options, selectedValue, onChange, name }: RadioButtonGroupProps) => (
  <div className="mt-2 flex flex-wrap justify-center gap-3">
    {options.map(({ value, label }) => (
      <label key={value} className="relative">
        <input type="radio" name={name} value={value} checked={selectedValue === value}
          onChange={() => onChange(value)} className="hidden"
        />

        <span className={`px-4 py-2 rounded-lg border-2 transition cursor-pointer block text-center
                      ${selectedValue === value ? "bg-blue-500 text-white border-blue-600 shadow-md" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
        > {label}
        </span>
      </label>
    ))}
  </div>
));

interface FormFieldProps {
  label: string;
  children: ReactNode;
  id?: string;
  labelClassName?: string;
  containerClassName?: string;
}

const FormField = memo(({ label, children, id, labelClassName = "", containerClassName = "" }: FormFieldProps) => {
  const defaultLabelStyles = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <section className={`mb-4 ${containerClassName}`} aria-labelledby={id ? `${id}-label` : undefined}>
      <label id={id ? `${id}-label` : undefined} htmlFor={id}
        className={`${defaultLabelStyles} ${labelClassName}`}
      >
        {label}
      </label>
      {children}
    </section>
  );
});

interface GameFormViewProps {
  selectedGameType: number;
  niveau: number;
  setNiveau: (niveau: number) => void;
  lancerJeu: () => void;
}

const GameFormView = memo(({
  selectedGameType,
  niveau,
  setNiveau,
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

      <p className="text-gray-700 text-center py-3 px-4 border border-gray-300 rounded-xl mb-5 font-semibold">
        🎮 Jeu sélectionné : {choix(selectedGameType)}
      </p>

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


export default function Principale() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { randomImage, onlineStatus } = useCommon();

  const tpsglobal = Number(searchParams.get('tpsglobal') || "0");

  const [niveau, setNiveau] = useState(2);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleBack = useCallback(() => {
    router.push('/star/learning');
  }, []);

  const lancerJeu = useCallback(async () => {
    router.push(`/star/learning/game?niveau=${niveau}&tpsglobal=${tpsglobal}`);
  }, [niveau, router]);

  const handleClick = () => {
    window.location.href = '/star/learning';
  };

  return (
    <motion.div
      key="main"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring" }}
      className=" w-full flex items-center justify-center"
    >
      <div className="relative w-full mx-auto max-w-md mt-8 bg-white  dark:from-gray-900 dark:to-gray-800 rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleClick}
            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Retour à l'accueil"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Home className="relative w-5 h-5 text-white" />
          </motion.button>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              DIAMBRA LEARNING
            </span>
          </div>
          <div className="w-12" />
        </div>

        <div className="p-4">
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className=" flex flex-col items-center justify-center gap-2 space-y-4 space-x-4 max-w-4xl mx-auto"
          >
            <GameFormView
              selectedGameType={tpsglobal}
              niveau={niveau}
              setNiveau={setNiveau}
              lancerJeu={lancerJeu}
            />

            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm font-medium text-gray-700"
            >
              ← Retour au menu
            </button>
          </motion.div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl shadow-xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden"
          >
            <Image
              src={randomImage}
              width={400}
              height={500}
              alt="DIAMBRA"
              className="w-full h-144 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>

          <footer className="relative mt-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-center shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="relative flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>© {currentYear}</span>
              </div>

              <div className=" right-4 z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${onlineStatus.color === 'red' ? 'bg-red-500' : 'bg-green-500'} text-white flex items-center gap-1`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  {onlineStatus.text}
                </div>
              </div>
            </div>
            <p className="relative text-gray-500 text-[10px] mt-2">
              DIAMBRA CORPORATION • Tous droits réservés
            </p>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}