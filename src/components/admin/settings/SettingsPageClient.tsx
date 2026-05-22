'use client';
import useSettingsPage from '@/hooks/admin/settings/useSettingsPage';
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle, Bell, Building, CheckCircle, Clock, CreditCard, Database, DollarSign,
  Eye, EyeOff, Globe, Loader, Lock, Mail, MessageSquare, Phone, RefreshCw,
  Save, Server, Settings, Shield, Users, Zap
} from 'lucide-react';
import React, { memo } from "react";

type PaymentMethod = 'orangeMoney' | 'mtnMoney' | 'moovMoney' | 'wave';
type TabId = 'general' | 'notifications' | 'payment' | 'security' | 'system';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description?: string;
}

const ToggleSwitch = memo(({
  enabled,
  onChange,
  activeColor = 'bg-blue-600',
  disabled = false
}: {
  enabled: boolean;
  onChange: () => void;
  activeColor?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${enabled ? activeColor : 'bg-gray-200 dark:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
  </button>
));

ToggleSwitch.displayName = 'ToggleSwitch';

const SettingsInput = memo(({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon: Icon,
  helperText
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  helperText?: string;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
));

SettingsInput.displayName = 'SettingsInput';

const SettingsSelect = memo(({
  label,
  value,
  onChange,
  options,
  icon: Icon
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  icon?: React.ElementType;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
));

SettingsSelect.displayName = 'SettingsSelect';

const SettingsCard = memo(({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
));

SettingsCard.displayName = 'SettingsCard';

const SettingsSection = memo(({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="space-y-5">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
      <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
));

SettingsSection.displayName = 'SettingsSection';

// ============================================================================
// ONGLETS
// ============================================================================

interface SettingsTabsProps {
  tabs: readonly Tab[];
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const SettingsTabs = memo(({ tabs, activeTab, setActiveTab }: SettingsTabsProps) => (
  <>
    {/* Mobile Select */}
    <div className="lg:hidden">
      <select
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as TabId)}
        className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
      >
        {tabs.map(tab => (
          <option key={tab.id} value={tab.id}>{tab.label}</option>
        ))}
      </select>
    </div>

    {/* Desktop Tabs */}
    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 sticky top-24">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-1.5
              ${isActive
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
            <span className="font-medium text-sm">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
              />
            )}
          </button>
        );
      })}
    </div>
  </>
));

SettingsTabs.displayName = 'SettingsTabs';

const SettingsSaveButton = memo(({ isSaving, saveSuccess, onClick }: { isSaving: boolean; saveSuccess: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={!isSaving && !saveSuccess ? { scale: 1.02 } : {}}
    whileTap={!isSaving && !saveSuccess ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={isSaving}
    className={`
      flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300
      ${isSaving
        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        : saveSuccess
          ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl'
      }
    `}
  >
    {isSaving ? (
      <>
        <Loader className="w-4 h-4 animate-spin" />
        <span>Enregistrement...</span>
      </>
    ) : saveSuccess ? (
      <>
        <CheckCircle className="w-4 h-4" />
        <span>Enregistré !</span>
      </>
    ) : (
      <>
        <Save className="w-4 h-4" />
        <span>Enregistrer</span>
      </>
    )}
  </motion.button>
));

SettingsSaveButton.displayName = 'SettingsSaveButton';

interface SettingsGeneralTabProps {
  siteName: string;
  setSiteName: (v: string) => void;
  siteEmail: string;
  setSiteEmail: (v: string) => void;
  sitePhone: string;
  setSitePhone: (v: string) => void;
  maintenanceMode: boolean;
  setMaintenanceMode: (v: boolean) => void;
}

export const SettingsGeneralTab = memo(({
  siteName, setSiteName, siteEmail, setSiteEmail,
  sitePhone, setSitePhone, maintenanceMode, setMaintenanceMode
}: SettingsGeneralTabProps) => (
  <SettingsSection title="Paramètres généraux" icon={Globe}>
    <SettingsInput icon={Building} label="Nom du site" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="Mon site" helperText="Nom affiché dans l'application" />
    <SettingsInput icon={Mail} label="Email de contact" type="email" value={siteEmail} onChange={e => setSiteEmail(e.target.value)} placeholder="contact@example.com" />
    <SettingsInput icon={Phone} label="Téléphone" type="tel" value={sitePhone} onChange={e => setSitePhone(e.target.value)} placeholder="+225 XX XX XX XX" />
    <div className="pt-2 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">🔧 Mode maintenance</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Désactiver temporairement l'accès au site</p>
      </div>
      <ToggleSwitch enabled={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} activeColor="bg-red-600" />
    </div>
  </SettingsSection>
));

SettingsGeneralTab.displayName = 'SettingsGeneralTab';

// ============================================================================
// ONGLET NOTIFICATIONS
// ============================================================================

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

export const SettingsNotificationsTab = memo(({
  emailNotifications, setEmailNotifications, newUserNotif, setNewUserNotif,
  newConsultationNotif, setNewConsultationNotif, paymentNotif, setPaymentNotif
}: SettingsNotificationsTabProps) => {
  const notifications = [
    { id: 'email', title: 'Notifications par email', desc: 'Recevoir des alertes par email', enabled: emailNotifications, setter: setEmailNotifications, color: 'bg-blue-600', icon: Mail },
    { id: 'user', title: 'Nouvel utilisateur', desc: 'Alert lors d\'une inscription', enabled: newUserNotif, setter: setNewUserNotif, color: 'bg-green-600', icon: Users },
    { id: 'consultation', title: 'Nouvelle consultation', desc: 'Alert pour chaque commande', enabled: newConsultationNotif, setter: setNewConsultationNotif, color: 'bg-purple-600', icon: MessageSquare },
    { id: 'payment', title: 'Paiements', desc: 'Alert pour chaque transaction', enabled: paymentNotif, setter: setPaymentNotif, color: 'bg-amber-600', icon: DollarSign }
  ];

  return (
    <SettingsSection title="Notifications" icon={Bell}>
      {notifications.map(notif => (
        <div key={notif.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${notif.color} bg-opacity-10`}>
              <notif.icon className={`w-4 h-4 ${notif.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{notif.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{notif.desc}</p>
            </div>
          </div>
          <ToggleSwitch enabled={notif.enabled} onChange={() => notif.setter(!notif.enabled)} activeColor={notif.color} />
        </div>
      ))}
    </SettingsSection>
  );
});

SettingsNotificationsTab.displayName = 'SettingsNotificationsTab';

// ============================================================================
// ONGLET PAIEMENT
// ============================================================================

interface SettingsPaymentTabProps {
  moneyFusionApiKey: string;
  setMoneyFusionApiKey: (v: string) => void;
  showApiKey: boolean;
  setShowApiKey: (v: boolean) => void;
  paymentMethods: Record<PaymentMethod, boolean>;
  setPaymentMethods: (fn: (prev: Record<PaymentMethod, boolean>) => Record<PaymentMethod, boolean>) => void;
}

export const SettingsPaymentTab = memo(({
  moneyFusionApiKey, setMoneyFusionApiKey, showApiKey, setShowApiKey,
  paymentMethods, setPaymentMethods
}: SettingsPaymentTabProps) => {
  const methods = [
    { id: 'orangeMoney', label: 'Orange Money', color: 'text-orange-600 dark:text-orange-400', activeColor: 'bg-orange-600' },
    { id: 'mtnMoney', label: 'MTN Money', color: 'text-yellow-600 dark:text-yellow-400', activeColor: 'bg-yellow-600' },
    { id: 'moovMoney', label: 'Moov Money', color: 'text-blue-600 dark:text-blue-400', activeColor: 'bg-blue-600' },
    { id: 'wave', label: 'Wave', color: 'text-gray-700 dark:text-gray-400', activeColor: 'bg-gray-700' }
  ];

  return (
    <SettingsSection title="Configuration paiement" icon={CreditCard}>
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Clé API MoneyFusion</label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={moneyFusionApiKey}
            onChange={e => setMoneyFusionApiKey(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-2.5 pr-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez votre clé API"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Méthodes de paiement actives</p>
        <div className="space-y-2">
          {methods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className={`text-sm font-medium ${method.color}`}>{method.label}</span>
              <ToggleSwitch
                enabled={paymentMethods[method.id as PaymentMethod]}
                onChange={() => setPaymentMethods(prev => ({ ...prev, [method.id]: !prev[method.id as PaymentMethod] }))}
                activeColor={method.activeColor}
              />
            </div>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
});

SettingsPaymentTab.displayName = 'SettingsPaymentTab';

// ============================================================================
// ONGLET SÉCURITÉ
// ============================================================================

interface SettingsSecurityTabProps {
  twoFactorAuth: boolean;
  setTwoFactorAuth: (v: boolean) => void;
  sessionTimeout: string;
  setSessionTimeout: (v: string) => void;
  passwordExpiry: string;
  setPasswordExpiry: (v: string) => void;
}

export const SettingsSecurityTab = memo(({
  twoFactorAuth, setTwoFactorAuth, sessionTimeout, setSessionTimeout, passwordExpiry, setPasswordExpiry
}: SettingsSecurityTabProps) => (
  <SettingsSection title="Sécurité" icon={Shield}>
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">🛡️ Authentification 2FA</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Double authentification requise pour les comptes admin</p>
      </div>
      <ToggleSwitch enabled={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} activeColor="bg-green-600" />
    </div>
    <SettingsInput icon={Clock} label="Timeout de session (minutes)" type="number" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} helperText="Durée d'inactivité avant déconnexion" />
    <SettingsInput icon={Lock} label="Expiration mot de passe (jours)" type="number" value={passwordExpiry} onChange={e => setPasswordExpiry(e.target.value)} helperText="0 = jamais" />
  </SettingsSection>
));

SettingsSecurityTab.displayName = 'SettingsSecurityTab';

// ============================================================================
// ONGLET SYSTÈME
// ============================================================================

interface SettingsSystemTabProps {
  maxUploadSize: string;
  setMaxUploadSize: (v: string) => void;
  backupFrequency: string;
  setBackupFrequency: (v: string) => void;
  logLevel: string;
  setLogLevel: (v: string) => void;
}

export const SettingsSystemTab = memo(({
  maxUploadSize, setMaxUploadSize, backupFrequency, setBackupFrequency, logLevel, setLogLevel
}: SettingsSystemTabProps) => (
  <SettingsSection title="Paramètres système" icon={Database}>
    <SettingsInput icon={Server} label="Taille max upload (MB)" type="number" value={maxUploadSize} onChange={e => setMaxUploadSize(e.target.value)} helperText="Taille maximale des fichiers uploadés" />
    <SettingsSelect
      icon={RefreshCw}
      label="Fréquence de sauvegarde"
      value={backupFrequency}
      onChange={e => setBackupFrequency(e.target.value)}
      options={[
        { value: 'daily', label: '📅 Quotidienne' },
        { value: 'weekly', label: '📆 Hebdomadaire' },
        { value: 'monthly', label: '🗓️ Mensuelle' }
      ]}
    />
    <SettingsSelect
      icon={Zap}
      label="Niveau de logs"
      value={logLevel}
      onChange={e => setLogLevel(e.target.value)}
      options={[
        { value: 'error', label: '❌ Erreurs uniquement' },
        { value: 'warning', label: '⚠️ Avertissements' },
        { value: 'info', label: 'ℹ️ Informations' },
        { value: 'debug', label: '🐛 Debug' }
      ]}
    />
    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-950/40 transition-all border-2 border-red-200 dark:border-red-800 group">
      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
      Vider le cache
      <AlertCircle className="w-4 h-4" />
    </button>
  </SettingsSection>
));

SettingsSystemTab.displayName = 'SettingsSystemTab';

// ============================================================================
// LAYOUT PRINCIPAL
// ============================================================================

interface SettingsLayoutProps {
  children: React.ReactNode;
  tabs: readonly Tab[];
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isSaving: boolean;
  saveSuccess: boolean;
  onSave: () => void;
}

const SettingsLayout = memo(({ children, tabs, activeTab, setActiveTab, isSaving, saveSuccess, onSave }: SettingsLayoutProps) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
    {/* Header */}
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Configuration de l'application</p>
            </div>
          </div>
          <SettingsSaveButton isSaving={isSaving} saveSuccess={saveSuccess} onClick={onSave} />
        </div>
      </div>
    </div>

    {/* Contenu principal */}
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 flex-shrink-0">
          <SettingsTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  </div>
));

SettingsLayout.displayName = 'SettingsLayout';

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const SettingsTabContent = memo(({ activeTab, tabProps }: { activeTab: TabId; tabProps: any }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <SettingsCard>
        <div className="p-6">
          {activeTab === 'general' && <SettingsGeneralTab {...tabProps.general} />}
          {activeTab === 'notifications' && <SettingsNotificationsTab {...tabProps.notifications} />}
          {activeTab === 'payment' && <SettingsPaymentTab {...tabProps.payment} />}
          {activeTab === 'security' && <SettingsSecurityTab {...tabProps.security} />}
          {activeTab === 'system' && <SettingsSystemTab {...tabProps.system} />}
        </div>
      </SettingsCard>
    </motion.div>
  </AnimatePresence>
));

SettingsTabContent.displayName = 'SettingsTabContent';

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export default function SettingsPageClient() {
  const { tabProps, activeTab, isSaving, saveSuccess, handleSave, setActiveTab } = useSettingsPage();

  const tabs: readonly Tab[] = [
    { id: 'general', label: 'Général', icon: Globe, description: 'Configuration du site' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alertes et emails' },
    { id: 'payment', label: 'Paiement', icon: CreditCard, description: 'Moyens de paiement' },
    { id: 'security', label: 'Sécurité', icon: Lock, description: 'Protection et accès' },
    { id: 'system', label: 'Système', icon: Database, description: 'Performance et logs' },
  ];

  return (
    <main id="admin-settings-main" className="focus:outline-none">
      <h1 className="sr-only">Gestion des paramètres</h1>
      <SettingsLayout
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
      >
        <SettingsTabContent activeTab={activeTab} tabProps={tabProps} />
      </SettingsLayout>
    </main>
  );
}