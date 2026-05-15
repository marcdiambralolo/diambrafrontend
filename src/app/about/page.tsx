import AboutPage from "@/components/about/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "À propos — Diambra",
    description:
        "Diambra est un jeu en ligne.",
    alternates: { canonical: "/a-propos" },
    openGraph: {
        title: "À propos — Diambra",
        description:
            "Diambra est un jeu en ligne.",
        url: "/a-propos",
        type: "website",
        images: [
            {
                url: "/logo.png",
                width: 512,
                height: 512,
                alt: "Logo Diambra",
            },
        ],
    },
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export default function AboutPageWrapper() {

    return <AboutPage />;
}