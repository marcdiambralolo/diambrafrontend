'use client';
import React from 'react';
import { CreditCard, Eye, EyeOff } from 'lucide-react';

interface SettingsPaymentTabProps {
  moneyFusionApiKey: string;
  setMoneyFusionApiKey: (v: string) => void;
  showApiKey: boolean;
  setShowApiKey: (v: boolean) => void;
  paymentMethods: {
    orangeMoney: boolean;
    mtnMoney: boolean;
    moovMoney: boolean;
    wave: boolean;
  };
  setPaymentMethods: (fn: (prev: {
    orangeMoney: boolean;
    mtnMoney: boolean;
    moovMoney: boolean;
    wave: boolean;
  }) => {
    orangeMoney: boolean;
    mtnMoney: boolean;
    moovMoney: boolean;
    wave: boolean;
  }) => void;
}

export default function SettingsPaymentTab({ moneyFusionApiKey, setMoneyFusionApiKey, showApiKey, setShowApiKey, paymentMethods, setPaymentMethods }: SettingsPaymentTabProps) {
 
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#2E5AA6] dark:text-cosmic-pink">
          <CreditCard className="w-5 h-5 text-cosmic-indigo dark:text-cosmic-pink" />
          Configuration paiement
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink mb-1">Clé API MoneyFusion</label>
            <div className="relative">
              <input type={showApiKey ? 'text' : 'password'} value={moneyFusionApiKey} onChange={e => setMoneyFusionApiKey(e.target.value)} className="w-full bg-white dark:bg-[#162A56] border border-cosmic-indigo dark:border-cosmic-pink text-sm text-cosmic-purple dark:text-cosmic-pink px-3 py-2 pr-10 rounded-lg focus:ring-2 focus:ring-cosmic-indigo dark:focus:ring-cosmic-pink" />
              <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-cosmic-indigo dark:text-cosmic-pink hover:text-cosmic-purple dark:hover:text-cosmic-pink/80">
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink mb-3">Méthodes de paiement actives</p>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-orange-600 dark:text-orange-400">Orange Money</span>
                <button onClick={() => setPaymentMethods((prev) => ({ ...prev, orangeMoney: !prev.orangeMoney }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentMethods.orangeMoney ? 'bg-orange-600 dark:bg-orange-400' : 'bg-gray-200 dark:bg-[#162A56]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${paymentMethods.orangeMoney ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-yellow-600 dark:text-yellow-400">MTN Money</span>
                <button onClick={() => setPaymentMethods((prev) => ({ ...prev, mtnMoney: !prev.mtnMoney }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentMethods.mtnMoney ? 'bg-yellow-600 dark:bg-yellow-400' : 'bg-gray-200 dark:bg-[#162A56]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${paymentMethods.mtnMoney ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-blue-600 dark:text-cosmic-pink">Moov Money</span>
                <button onClick={() => setPaymentMethods((prev) => ({ ...prev, moovMoney: !prev.moovMoney }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentMethods.moovMoney ? 'bg-cosmic-indigo dark:bg-cosmic-pink' : 'bg-gray-200 dark:bg-[#162A56]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${paymentMethods.moovMoney ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Wave</span>
                <button onClick={() => setPaymentMethods((prev) => ({ ...prev, wave: !prev.wave }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentMethods.wave ? 'bg-[#2E5AA6]' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${paymentMethods.wave ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
