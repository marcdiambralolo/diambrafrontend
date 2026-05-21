import { CreditCard, FileText, LayoutDashboard, Settings, Shield, Users } from 'lucide-react';

export const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, color: 'amber' },
  { href: '/admin/game', label: 'Editions', icon: Settings, color: 'gray' },
  { href: '/admin/consultations', label: 'Jeux', icon: FileText, color: 'green' },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users, color: 'blue' },
  { href: '/admin/offrandes', label: 'Jetons', icon: Shield, color: 'cyan' },
  { href: '/admin/payments', label: 'Paiements', icon: CreditCard, color: 'ocean' },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings, color: 'gray' },
];

export const colorClasses = {
  amber: 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400',
  blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400',
  cyan: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400',
  emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400',
  green: 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400',
  indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400',
  ocean: 'bg-blue-50 text-[#2E5AA6] hover:bg-blue-100 dark:bg-[#163A74]/40 dark:text-[#9BC2FF]',
  orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400',
  gray: 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-950/30 dark:text-gray-400',
  teal: 'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/30 dark:text-teal-400',
};