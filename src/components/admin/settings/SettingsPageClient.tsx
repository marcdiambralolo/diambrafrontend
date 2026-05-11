'use client';
import SettingsGeneralTab from "@/components/admin/settings/SettingsGeneralTab";
import SettingsNotificationsTab from "@/components/admin/settings/SettingsNotificationsTab";
import SettingsPaymentTab from "@/components/admin/settings/SettingsPaymentTab";
import SettingsSecurityTab from "@/components/admin/settings/SettingsSecurityTab";
import SettingsSystemTab from "@/components/admin/settings/SettingsSystemTab";
import useSettingsPage from '@/hooks/admin/settings/useSettingsPage';
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CreditCard, Database, Lock, Settings } from 'lucide-react';
import React from "react";
import SettingsHeader from "./SettingsHeader";
import SettingsSaveButton from "./SettingsSaveButton";

type TabId = string;
interface SettingsTabsProps<T extends TabId = string> {
  tabs: readonly Tab[];
  activeTab: T;
  setActiveTab: (tab: T) => void;
}

export function SettingsTabs<T extends TabId = string>({ tabs, activeTab, setActiveTab }: SettingsTabsProps<T>) {

  return (
    <>
      <div className="lg:hidden">
        <select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value as T)}
          className="w-full bg-white border border-gray-300 text-sm text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          {tabs.map(tab => (
            <option key={tab.id} value={tab.id}>{tab.label}</option>
          ))}
        </select>
      </div>
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as T)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all mb-1 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold'
                : 'text-gray-700 hover:bg-gray-50 font-medium'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

type SettingsTabProps = {
  general: React.ComponentProps<typeof SettingsGeneralTab>;
  notifications: React.ComponentProps<typeof SettingsNotificationsTab>;
  security: React.ComponentProps<typeof SettingsSecurityTab>;
  payment: React.ComponentProps<typeof SettingsPaymentTab>;
  system: React.ComponentProps<typeof SettingsSystemTab>;
};

interface SettingsTabContentProps {
  activeTab: string;
  tabProps: SettingsTabProps;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ activeTab, tabProps }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
    >
      {activeTab === 'general' && <SettingsGeneralTab {...tabProps.general} />}

      {activeTab === 'notifications' && <SettingsNotificationsTab {...tabProps.notifications} />}

      {activeTab === 'security' && <SettingsSecurityTab {...tabProps.security} />}

      {activeTab === 'payment' && <SettingsPaymentTab {...tabProps.payment} />}

      {activeTab === 'system' && <SettingsSystemTab {...tabProps.system} />}
    </motion.div>
  </AnimatePresence>
);

type Tab = { id: string; label: string; icon: React.ElementType };

interface SettingsLayoutProps {
  children: React.ReactNode;
  tabs: readonly Tab[] | Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSaving: boolean;
  saveSuccess: boolean;
  onSave: () => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children, tabs, activeTab, setActiveTab, isSaving, saveSuccess, onSave
}) => (
  <div className="bg-gray-50">
    <SettingsHeader />
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex justify-end">
      <SettingsSaveButton isSaving={isSaving} saveSuccess={saveSuccess} onClick={onSave} />
    </div>

    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-64 flex-shrink-0">
          <SettingsTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <section className="flex-1" role="region" aria-label="Contenu des paramètres">
          {children}
        </section>
      </div>
    </div>
  </div>
);

type SettingsTabId = 'general' | 'notifications' | 'payment' | 'security' | 'system';

export default function SettingsPageClient() {
  const { tabProps, activeTab, isSaving, saveSuccess, handleSave, setActiveTab, } = useSettingsPage();

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'system', label: 'Système', icon: Database },
  ] as const;

  return (
    <>
      {/* Skip link accessibilité */}
      <a href="#admin-settings-main" className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-cosmic-indigo text-white font-bold px-4 py-2 rounded-xl">Aller au contenu principal</a>
      <main id="admin-settings-main" aria-labelledby="admin-settings-title">
        {/* h1 sr-only pour accessibilité, le header visuel reste */}
        <h1 id="admin-settings-title" className="sr-only">Gestion des paramètres</h1>

        <SettingsLayout
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={(tab: string) => setActiveTab(tab as SettingsTabId)}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          onSave={handleSave}
        >
          <SettingsTabContent activeTab={activeTab} tabProps={tabProps} />
        </SettingsLayout>
      </main>
    </>
  );
}