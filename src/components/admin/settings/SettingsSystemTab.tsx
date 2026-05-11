'use client';
import React from 'react';
import { Database, AlertCircle } from 'lucide-react';

interface SettingsSystemTabProps {
  maxUploadSize: string;
  setMaxUploadSize: (v: string) => void;
  backupFrequency: string;
  setBackupFrequency: (v: string) => void;
  logLevel: string;
  setLogLevel: (v: string) => void;
}

export default function SettingsSystemTab({ maxUploadSize, setMaxUploadSize, backupFrequency, setBackupFrequency, logLevel, setLogLevel }: SettingsSystemTabProps) {

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#2E5AA6] dark:text-cosmic-pink">
          <Database className="w-5 h-5 text-cosmic-indigo dark:text-cosmic-pink" />
          Paramètres système
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1">Taille max upload (MB)</label>
            <input type="number" value={maxUploadSize} onChange={e => setMaxUploadSize(e.target.value)} className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-3 py-2 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink" />
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1">Fréquence de sauvegarde</label>
            <select value={backupFrequency} onChange={e => setBackupFrequency(e.target.value)} className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-3 py-2 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink">
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1">Niveau de logs</label>
            <select value={logLevel} onChange={e => setLogLevel(e.target.value)} className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-3 py-2 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink">
              <option value="error">Erreurs uniquement</option>
              <option value="warning">Avertissements</option>
              <option value="info">Informations</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200">
              <AlertCircle className="w-4 h-4" />
              Vider le cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}