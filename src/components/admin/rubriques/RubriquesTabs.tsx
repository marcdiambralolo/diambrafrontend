'use client';
import React from 'react';

type RubriquesTabsProps = {
  activeTab: 'gestion' | 'overview';
  setActiveTab: (tab: 'gestion' | 'overview') => void;
};

export const RubriquesTabs: React.FC<RubriquesTabsProps> = ({ activeTab, setActiveTab }) => (
  <div className="mb-6 flex gap-2">
    <button
      className={`rounded-t-lg border-b-2 px-4 py-2 font-semibold transition ${activeTab === 'gestion' ? 'border-[#2E5AA6] bg-white text-[#1E3A6E] dark:border-[#4F83D1] dark:bg-[#0F1C3F] dark:text-[#DDE7FA]' : 'border-transparent bg-blue-50 text-[#2E5AA6] hover:bg-blue-100 dark:bg-[#13274C] dark:text-[#9BC2FF] dark:hover:bg-[#163A74]'}`}
      onClick={() => setActiveTab('gestion')}
    >
      Gestion des rubriques
    </button>
    
    <button
      className={`rounded-t-lg border-b-2 px-4 py-2 font-semibold transition ${activeTab === 'overview' ? 'border-[#4F83D1] bg-white text-[#21457F] dark:border-[#9BC2FF] dark:bg-[#0F1C3F] dark:text-[#DDE7FA]' : 'border-transparent bg-slate-100 text-[#2E5AA6] hover:bg-slate-200 dark:bg-[#13274C] dark:text-[#AFC0DE] dark:hover:bg-[#163A74]'}`}
      onClick={() => setActiveTab('overview')}
    >
      Vue d'Ensemble
    </button>
  </div>
);