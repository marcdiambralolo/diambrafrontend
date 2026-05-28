'use client';
import Loader from '@/app/loading';
import { useCategoryConsulterClient } from '@/hooks/learning/choix/useCategoryConsulterClient';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useGameGenerator";
import { useGameGenerator } from '@/hooks/learning/useGameGenerator';
import { formatDateFRJeu } from "@/lib/functions";
import { MenuItem } from "@/lib/interfaces";
import { BgColorsOutlined, FontSizeOutlined, GlobalOutlined, NumberOutlined, PictureOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Users } from "lucide-react";
import Image from "next/image";
import { FinMatchView, GamePlayView } from "../bonchoix/Features";
import { FooterSection } from "../game/Features";
import { ActiveBanner, ErrorToast, OfferSelection, StatCard } from './Features';

const menuItems: MenuItem[] = [
  { title: "Nombre", icon: <NumberOutlined />, tpsglobal: 0, color: "from-blue-500 to-cyan-500", gradient: "from-blue-600 to-cyan-500" },
  { title: "Lettre", icon: <FontSizeOutlined />, tpsglobal: 3, color: "from-green-500 to-emerald-500", gradient: "from-green-600 to-emerald-500" },
  { title: "Image", icon: <PictureOutlined />, tpsglobal: 2, color: "from-purple-500 to-fuchsia-500", gradient: "from-purple-600 to-fuchsia-500" },
  { title: "Couleur", icon: <BgColorsOutlined />, tpsglobal: 1, color: "from-red-500 to-rose-500", gradient: "from-red-600 to-rose-500" },
  { title: "Global", icon: <GlobalOutlined />, tpsglobal: 4, color: "from-orange-500 to-amber-500", gradient: "from-orange-600 to-amber-500" },
  { title: "Aide", icon: <QuestionCircleOutlined />, tpsglobal: -1, color: "from-gray-500 to-slate-500", gradient: "from-gray-600 to-slate-500" },
];

export default function ProfilPageClient() {
  const {
    handleGoToMarket, handleEndMatch, handleNext, clearError, handleItemClick, handleClick,
    onlineStatus, randomImage, currentYear, currentError, availableQuantity, cardClasses, isSufficient,
    requiredQuantity, afficheselection, gamehasStarted, error, loading, stats, startDate,
    endDate, gameConfig, affichebanner, jouer, tpsglobal, niveau
  } = useCategoryConsulterClient();
  const { gamePlayProps, jeuestfinie, } = useGameGenerator(niveau, tpsglobal);
  const { displayMatches } = useEndGameGenerator();

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-md mx-auto bg-white overflow-hidden mt-8 flex flex-col items-center justify-center px-2">
      <div className="w-full max-w-md mx-auto flex items-center justify-between">
        <motion.button
          onClick={handleClick}
          className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Retour à l'accueil"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Home className="relative w-6 h-6 text-white" />
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            DIAMBRA LEARNING
          </span>
        </motion.div>
      </div>

      {error && <ErrorToast message={currentError!} onClose={clearError} />}

      {gamehasStarted && (
        <>
          {jouer ? (
            <>
              {jeuestfinie ? (
                <FinMatchView infomatch={displayMatches} />
              ) : (
                <GamePlayView {...gamePlayProps} />
              )}

            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-md mx-auto mt-4"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="menu"
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, staggerChildren: 0.1 }}
                  >
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.title}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, type: "spring" }}
                        onClick={() => handleItemClick(item)}
                        className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-6 shadow-xl transition-all duration-300 hover:shadow-2xl`}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`Accéder à ${item.title}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <div className="relative flex flex-col items-center justify-center text-white">
                          <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <p className="text-lg font-bold group-hover:scale-105 transition-transform duration-300">
                            {item.title}
                          </p>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </>
      )}

      {afficheselection && (
        <div className="w-full max-w-md mx-auto ">
          <OfferSelection
            isSufficient={isSufficient}
            requiredQuantity={requiredQuantity}
            availableQuantity={availableQuantity}
            cardClasses={cardClasses}
            onNext={handleNext}
            onGoToMarket={handleGoToMarket}
          />
        </div>
      )}

      <div className="w-full max-w-md mx-auto mt-8">
        <AnimatePresence mode="wait">
          {affichebanner && (
            <ActiveBanner
              key="active"
              endDate={endDate}
              handleEndMatch={handleEndMatch}
              startDate={startDate}
              formatDate={formatDateFRJeu}
              gameConfig={gameConfig}
            />
          )}
        </AnimatePresence>

        <StatCard
          value={stats?.subscribers ?? null}
          label="Participants"
          icon={<Users className="w-4 h-4" />}
          loading={loading}
          color="from-purple-600 to-indigo-600"
          delay={0.2}
        />
      </div>

      <div className="w-full max-w-md mx-auto mt-2">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden"
          >
            <Image
              src={randomImage}
              width={400}
              height={300}
              alt="DIAMBRA"
              className="w-full h-144 object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>

          <FooterSection currentYear={currentYear} onlineStatus={onlineStatus} />
        </div>
      </div>
    </div>
  );
}