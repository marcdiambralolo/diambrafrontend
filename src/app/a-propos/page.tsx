import AboutPage from "@/components/about/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "À propos — Mon Étoile",
    description:
        "Mon Étoile est une plateforme initiatique dédiée à la connaissance de soi, la guidance spirituelle et l’élévation de la conscience : astrologie, numérologie, rituels, librairie, enseignements et système de grades.",
    alternates: { canonical: "/a-propos" },
    openGraph: {
        title: "À propos — Mon Étoile",
        description:
            "Plateforme initiatique de connaissance de soi : 6 piliers, système de grades, offrande sacrée avant consultation.",
        url: "/a-propos",
        type: "website",
        images: [
            {
                url: "/logo.png",
                width: 512,
                height: 512,
                alt: "Logo Mon Étoile",
            },
        ],
    },
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export default function Page() {

    return <AboutPage />;
}