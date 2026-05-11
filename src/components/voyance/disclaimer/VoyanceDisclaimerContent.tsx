"use client";
import CacheLink from '@/components/commons/CacheLink';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { CheckCircle, Eye, Heart, Info, Shield, Sparkles, Star } from 'lucide-react';
import { useRef, useState } from 'react';

const StarFallback = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`flex items-center justify-center rounded-full bg-amber-50 shadow-lg shadow-amber-200/50 ${className}`}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md animate-pulse"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.2"
      />
    </svg>
  </div>
);

const InfoCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 sm:p-6"
    >
      {children}
    </motion.div>
  );
};

export default function VoyanceDisclaimerContent() {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-amber-50/30 py-8 px-4 sm:py-12">
      <div className="mx-auto max-w-4xl">

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-[36px] border border-amber-100 bg-white shadow-2xl shadow-slate-200/50"
        >

          <div className="relative border-b border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 px-6 py-8 text-center sm:px-10 sm:py-10">
            {/* Étoiles décoratives */}
            <div className="absolute top-4 right-4 opacity-30">
              <StarFallback className="w-8 h-8" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-700 backdrop-blur-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              Avertissement légal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-5 text-4xl font-black tracking-tight bg-gradient-to-r from-slate-800 to-amber-700 bg-clip-text text-transparent sm:text-5xl"
            >
              CADRE ÉTHIQUE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-sm text-slate-500 max-w-md mx-auto"
            >
              Transparence totale pour une confiance absolue
            </motion.p>
          </div>

          {/* Corps du contenu */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="space-y-6 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-700"
              >
                La rubrique <span className="font-black text-amber-600">GUIDANCE</span> de la plateforme MON ÉTOILE est une interface permettant aux visiteurs d’entrer en contact avec des médiums, voyants et guides spirituels indépendants.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                Ces praticiens se sont inscrits librement sur la plateforme afin de proposer leurs services aux personnes qui souhaitent les consulter.
              </motion.p>

              <InfoCard delay={0.7}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="rounded-2xl bg-amber-100 p-2.5">
                      <Eye className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg mb-3">Points essentiels à connaître :</p>
                    <ul className="space-y-3 text-slate-600">
                      {[
                        "Les médiums et guides spirituels présents dans cette rubrique n'exercent pas pour le compte de MON ÉTOILE.",
                        "Ils interviennent en toute indépendance et demeurent seuls responsables des consultations, conseils et services qu'ils proposent.",
                        "La plateforme MON ÉTOILE agit uniquement comme une interface de mise en relation entre les consultants et les praticiens."
                      ].map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.1 }}
                          className="flex items-start gap-2.5 group cursor-pointer"
                          onMouseEnter={() => setShowTooltip(item.slice(0, 30))}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          <CheckCircle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-sm sm:text-base">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </InfoCard>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="rounded-2xl bg-gradient-to-r from-amber-50 to-white border border-amber-100 p-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-amber-100 p-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                    <span className="font-black text-slate-700">Avis communautaires</span>
                  </div>
                  <p className="flex-1 text-sm text-slate-600">
                    Afin de garantir une expérience transparente et utile pour tous, nous vous invitons, après chaque consultation, à laisser un avis ou un commentaire sur le profil du praticien que vous avez consulté.
                  </p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Vos retours permettront à l'ensemble des utilisateurs de disposer d'une appréciation objective sur la qualité des services proposés par chacun.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="font-semibold text-slate-800 bg-amber-50/50 -mx-5 px-5 py-3 rounded-xl"
              >
                <Heart className="w-4 h-4 text-amber-500 inline mr-2" />
                La communauté contribue ainsi à créer un espace de confiance et de discernement pour tous.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mt-10 flex justify-center sm:justify-end"
            >
              <CacheLink
                href="/star/voyance"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-8 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-slate-300/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-200/30 focus:outline-none focus:ring-4 focus:ring-amber-300/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  J'ai Compris
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </CacheLink>
            </motion.div>
          </div>
        </motion.section>
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-800 px-4 py-2 text-xs text-white shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Info className="w-3 h-3" />
                {showTooltip}...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}