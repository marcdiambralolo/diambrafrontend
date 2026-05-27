"use client";
import { useCommon } from "@/hooks/learning/useCommon";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import MenuDiambra from "./MenuDiambra";

export default function Principale() {
  const { randomImage, onlineStatus } = useCommon();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

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
      <div className="relative w-full mx-auto max-w-md mt-8 bg-white">
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

        <MenuDiambra />

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