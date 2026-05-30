'use client';
import { useMonEtoileStore } from "@/lib/store/monetoile.store";
import { memo } from 'react';
import { BannerSection, FooterImage, HeaderSection, HelpButton } from "./Features";
import TheGame from "./game/TheGame";
import HelpPanel from "./help/HelpPanel";
import LaCompetion from "./lacompetition/LaCompetion";
import LaMise from "./mise/LaMise";

const ProfilPageLearning = memo(() => {
  const { gameStarted, jeuAcommencer, afficheaide, afficherAide, afficherJeu } = useMonEtoileStore();

  return (
    <div className="w-full mx-auto max-w-2xl px-4 py-4">
      <HeaderSection />

      {afficheaide && <HelpPanel onClose={afficherJeu} />}

      {jeuAcommencer ? (
        <>
          {!afficheaide && (gameStarted ? <TheGame /> : <LaMise />)}
          <BannerSection />
        </>
      ) : (
        <LaCompetion />
      )}

      <FooterImage />
      {!afficheaide && jeuAcommencer && <HelpButton onClick={afficherAide} />}
    </div>
  );
});

export default ProfilPageLearning;