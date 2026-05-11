'use client';
import React from 'react';
import { Bell } from 'lucide-react';

interface SettingsNotificationsTabProps {
  emailNotifications: boolean;
  setEmailNotifications: (v: boolean) => void;
  newUserNotif: boolean;
  setNewUserNotif: (v: boolean) => void;
  newConsultationNotif: boolean;
  setNewConsultationNotif: (v: boolean) => void;
  paymentNotif: boolean;
  setPaymentNotif: (v: boolean) => void;
}

export default function SettingsNotificationsTab({ emailNotifications, setEmailNotifications, newUserNotif, setNewUserNotif, newConsultationNotif, setNewConsultationNotif, paymentNotif, setPaymentNotif }: SettingsNotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#2E5AA6] dark:text-cosmic-pink">
          <Bell className="w-5 h-5 text-cosmic-indigo dark:text-cosmic-pink" />
          Notifications
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-cosmic-indigo/30">
            <div>
              <p className="text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink">Notifications par email</p>
              <p className="text-xs text-cosmic-purple/70 dark:text-cosmic-pink/60">Recevoir des alertes par email</p>
            </div>
            <button onClick={() => setEmailNotifications(!emailNotifications)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-cosmic-indigo dark:bg-cosmic-pink' : 'bg-gray-200 dark:bg-[#162A56]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-cosmic-indigo/30">
            <div>
              <p className="text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink">Nouvel utilisateur</p>
              <p className="text-xs text-cosmic-purple/70 dark:text-cosmic-pink/60">Alert lors d'une inscription</p>
            </div>
            <button onClick={() => setNewUserNotif(!newUserNotif)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newUserNotif ? 'bg-cosmic-indigo dark:bg-cosmic-pink' : 'bg-gray-200 dark:bg-[#162A56]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newUserNotif ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-cosmic-indigo/30">
            <div>
              <p className="text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink">Nouvelle consultation</p>
              <p className="text-xs text-cosmic-purple/70 dark:text-cosmic-pink/60">Alert pour chaque commande</p>
            </div>
            <button onClick={() => setNewConsultationNotif(!newConsultationNotif)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newConsultationNotif ? 'bg-cosmic-indigo dark:bg-cosmic-pink' : 'bg-gray-200 dark:bg-[#162A56]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newConsultationNotif ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-cosmic-indigo dark:text-cosmic-pink">Paiements</p>
              <p className="text-xs text-cosmic-purple/70 dark:text-cosmic-pink/60">Alert pour chaque transaction</p>
            </div>
            <button onClick={() => setPaymentNotif(!paymentNotif)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentNotif ? 'bg-cosmic-indigo dark:bg-cosmic-pink' : 'bg-gray-200 dark:bg-[#162A56]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${paymentNotif ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}