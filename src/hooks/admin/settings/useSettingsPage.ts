import { useState } from 'react';

export default function useSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'payment' | 'system'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [siteName, setSiteName] = useState('Mon Étoile');
  const [siteEmail, setSiteEmail] = useState('contact@monetoile.org');
  const [sitePhone, setSitePhone] = useState('+225 07 58 38 53 87 ');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUserNotif, setNewUserNotif] = useState(true);
  const [newConsultationNotif, setNewConsultationNotif] = useState(true);
  const [paymentNotif, setPaymentNotif] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [moneyFusionApiKey, setMoneyFusionApiKey] = useState('mf_test_xxxxxxxxxxxxx');
  const [paymentMethods, setPaymentMethods] = useState({ orangeMoney: true, mtnMoney: true, moovMoney: true, wave: false });
  const [maxUploadSize, setMaxUploadSize] = useState('10');
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [logLevel, setLogLevel] = useState('error');

  const handleSave: () => Promise<void> = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabProps = {
    general: {
      siteName, setSiteName, siteEmail, setSiteEmail, sitePhone, setSitePhone, maintenanceMode, setMaintenanceMode
    },
    notifications: {
      emailNotifications, setEmailNotifications, newUserNotif, setNewUserNotif, newConsultationNotif, setNewConsultationNotif, paymentNotif, setPaymentNotif
    },
    security: {
      twoFactorAuth, setTwoFactorAuth, sessionTimeout, setSessionTimeout, passwordExpiry, setPasswordExpiry
    },
    payment: {
      moneyFusionApiKey, setMoneyFusionApiKey, showApiKey, setShowApiKey, paymentMethods, setPaymentMethods
    },
    system: {
      maxUploadSize, setMaxUploadSize, backupFrequency, setBackupFrequency, logLevel, setLogLevel
    }
  };

  return { activeTab, setActiveTab, isSaving, saveSuccess, handleSave, tabProps, };
}