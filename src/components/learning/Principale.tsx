"use client";
import { useCommon } from "@/hooks/learning/useCommon";
import { MenuItem } from "@/lib/interfaces";
import { BgColorsOutlined, FontSizeOutlined, GlobalOutlined, NumberOutlined, PictureOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FooterSection } from "./game/Features";

export default function Principale() {
  const router = useRouter();
  const { randomImage, onlineStatus } = useCommon();

  const menuItems: MenuItem[] = useMemo(
    () => [
      { title: "Nombre", icon: <NumberOutlined />, tpsglobal: 0, color: "bg-blue-500" },
      { title: "Lettre", icon: <FontSizeOutlined />, tpsglobal: 3, color: "bg-green-500" },
      { title: "Image", icon: <PictureOutlined />, tpsglobal: 2, color: "bg-purple-500" },
      { title: "Couleur", icon: <BgColorsOutlined />, tpsglobal: 1, color: "bg-red-500" },
      { title: "Global", icon: <GlobalOutlined />, tpsglobal: 4, color: "bg-orange-500" },
      { title: "Aide", icon: <QuestionCircleOutlined />, tpsglobal: -1, color: "bg-gray-500" },
    ],
    []
  );

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.tpsglobal === -1) {
      router.push('/aide');
    } else {
      router.push(`/star/learning/choix?tpsglobal=${item.tpsglobal}`);
    }
  }, [router,]);

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
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key="menu"
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {menuItems.map((item) => (
                  <motion.button
                    key={item.title}
                    onClick={() => handleItemClick(item)}
                    className={clsx(
                      "p-6 flex flex-col items-center justify-center rounded-xl shadow-md transition-all duration-300 text-white",
                      "hover:bg-opacity-80 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white",
                      item.color
                    )}
                    aria-label={`Accéder à ${item.title}`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <div className="text-5xl">{item.icon}</div>
                    <p className="mt-4 font-semibold">{item.title}</p>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div >
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

          <FooterSection currentYear={currentYear} onlineStatus={onlineStatus} />
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