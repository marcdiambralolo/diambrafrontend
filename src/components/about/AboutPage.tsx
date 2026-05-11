"use client";
import { cx } from "@/lib/functions";
import {
  ArrowLeft, BookOpen, ChevronRight, Flame, Info,
  ScrollText, ShieldCheck, Sparkles, Stars, Users,
} from "lucide-react";
import CacheLink from "../commons/CacheLink";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "../ui/ImageWithFallback";

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold text-white transition-all duration-300 " +
  "bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg active:scale-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition-all duration-300 " +
  "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm hover:shadow-md active:scale-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2";

export function ConicPanel({ children, className }: { children: React.ReactNode; className?: string }) {

  return (
    <div className={cx("rounded-[28px] p-[1px] bg-gradient-to-br from-slate-100 via-white to-slate-50 shadow-sm", className)}>
      <div className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 sm:p-7 shadow-lg">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)", backgroundSize: "14px 14px" }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

export function Pill({ icon, title, desc, tooltip }: { icon: React.ReactNode; title: string; desc: string; tooltip?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="relative flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-900">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="text-[12px] font-black text-slate-900">{title}</div>
          {tooltip && (
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="mt-1 text-[13px] leading-relaxed text-slate-600">{desc}</div>
      </div>
      {tooltip && showTooltip && (
        <div className="absolute left-0 top-full mt-2 z-10 w-48 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
}

export default function AboutPageClient() {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Header sticky avec fond blanc */}
      <nav className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
          <CacheLink href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft className="h-4 w-4" /> Accueil
          </CacheLink>
          <div className="hidden sm:flex items-center gap-2 text-[13px] font-extrabold">
            {["mission", "piliers", "grades", "offrandes", "ethique"].map((item) => (
              <a key={item} className="text-slate-500 hover:text-slate-900 transition" href={`#${item}`}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h1 className="text-balance text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Le premier pas dans la spiritualité, <br />c’est la connaissance de soi.
          </h1>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CacheLink href="/star/profil?r=1" className={btnPrimary}>
              Commencer le parcours <ChevronRight className="h-4 w-4" />
            </CacheLink>
            <CacheLink href="/star/grade" className={btnSecondary}>
              Comprendre les grades <ChevronRight className="h-4 w-4" />
            </CacheLink>
          </div>
        </section>

        <section id="mission" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <ConicPanel>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Qui sommes‑nous ?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600 sm:text-sm">
              Notre mission est simple, mais profonde : permettre à chacun de répondre à trois grandes questions de l’existence :
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {["Qui suis‑je ?", "D’où viens‑je ?", "Où vais‑je ?"].map((q) => (
                <li key={q} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center text-[13px] font-extrabold text-slate-800">
                  {q}
                </li>
              ))}
            </ul>
          </ConicPanel>
        </section>

        <section id="piliers" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-black text-slate-900">Nos domaines d’exploration</h2>
            <p className="mx-auto mt-2 max-w-3xl text-sm font-semibold text-slate-600">
              La plateforme s’articule autour de 6 grands piliers complémentaires.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Pill icon={<Stars className="h-5 w-5" />} title="1) Astrologie" desc="Consultations personnalisées, horoscope, transits." tooltip="Notre IA Deepseek analyse votre thème astral en temps réel." />
            <Pill icon={<ScrollText className="h-5 w-5" />} title="2) Numérologie" desc="Analyse des nombres : chemin de vie, cycles." />
            <Pill icon={<Sparkles className="h-5 w-5" />} title="3) Testament de la connaissance" desc="Enseignements spirituels, lois invisibles." />
            <Pill icon={<BookOpen className="h-5 w-5" />} title="4) Librairie ésotérique" desc="Ouvrages sélectionnés." />
            <Pill icon={<Flame className="h-5 w-5" />} title="5) Rituels sacrés" desc="Pratiques énergétiques." />
            <Pill icon={<Users className="h-5 w-5" />} title="6) Guidance" desc="Accès à des médiums certifiés." />
          </div>
        </section>

        <section id="grades" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <ConicPanel>
            <h2 className="text-2xl font-black text-slate-900">Un parcours initiatique unique : le système de grades</h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
              Mon Étoile repose sur un système structuré en 10 grades (0 à 9), pédagogique et psychologique.
            </p>
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-black text-slate-900">Les grades</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {["Néophyte (0)", "Aspirant (1)", "Contemplateur (2)", "Conscient (3)", "Intégrateur (4)", "Transmutant (5)", "Aligné (6)", "Éveillé (7)", "Sage (8)", "Maître de Soi (9)"].map((g) => (
                  <div key={g} className="rounded-2xl border border-slate-100 bg-white p-3 text-[13px] font-extrabold text-slate-700 shadow-sm">
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </ConicPanel>
        </section>

        <section id="offrandes" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <ConicPanel>
            <h2 className="text-2xl font-black text-slate-900">Le système d’offrandes</h2>
            <div className="mt-5 flex flex-col sm:flex-row gap-4 items-center">
              <ImageWithFallback
                src="https://placehold.co/80x80?text=Star"
                alt="Offrande symbolique"
                width={80}
                height={80}
                className="rounded-full shadow-md"
              />
              <p className="text-sm text-slate-600">Dans les traditions africaines, on n’achète pas la connaissance : on honore ce que l’on reçoit.</p>
            </div>
          </ConicPanel>
        </section>

        <section id="ethique" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <ConicPanel>
            <h2 className="text-2xl font-black text-slate-900">Nos engagements</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Pill icon={<ShieldCheck className="h-5 w-5" />} title="Confidentialité" desc="Échanges sécurisés, vie privée respectée." />
              <Pill icon={<ShieldCheck className="h-5 w-5" />} title="Cadre éthique strict" desc="Lutte contre les abus, responsabilisation." />
            </div>
          </ConicPanel>
        </section>
      </div>
    </main>
  );
}