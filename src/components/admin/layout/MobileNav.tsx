'use client';
import { useAuth } from '@/lib/auth/AuthContext';
import CacheLink from '@/components/commons/CacheLink';
import { AnimatePresence, motion,Variants  } from 'framer-motion';
import { Activity, LogOut, Menu, Sparkles, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { navItems } from '../commons/AdminNavConfig';
 

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      setIsLoggingOut(true);
      try {
        await logout();
        handleClose();
        router.replace('/auth/login');
        router.refresh();
      } catch (error) {
        console.error('Erreur de déconnexion:', error);
        setIsLoggingOut(false);
      }
    }
  }, [isLoggingOut, logout, handleClose, router]);

  const menuVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        staggerChildren: 0.05
      }
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const itemVariants: Variants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-white rounded-xl 
                   shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-gray-900" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5 text-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay avec blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white z-40 
                         shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header avec Logo */}
                <motion.div
                  variants={itemVariants}
                  className="px-6 pt-10 pb-4 bg-gradient-to-r from-amber-50 to-orange-50 
                             border-b border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 
                                 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white font-bold text-xl">M</span>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-amber-400 rounded-xl blur-md opacity-50 -z-10"
                      />
                    </motion.div>
                    <div>
                      <h2 className="font-bold text-gray-900 flex items-center gap-1.5">
                        Diambra
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </h2>
                      <p className="text-xs text-gray-600 font-medium">Administration</p>
                    </div>
                  </div>


                </motion.div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <motion.div
                        key={item.href}
                        variants={itemVariants}
                        custom={index}
                      >
                        <CacheLink
                          href={item.href}
                          onClick={handleClose}
                          className="group block"
                        >
                          <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg 
                                       transition-all duration-200 ${isActive
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            <div className={`p-1.5 rounded-md ${isActive
                              ? 'bg-white/20'
                              : 'bg-gray-100 group-hover:bg-gray-200'
                              } transition-colors`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>

                            {/* Badge "Active" */}
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="ml-auto"
                                >
                                  <Activity className="w-3.5 h-3.5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </CacheLink>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Logout Button */}
                <motion.div
                  variants={itemVariants}
                  className="px-6 py-4 border-t border-gray-200 bg-gray-50"
                >
                  <motion.button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 
                               hover:bg-red-50 rounded-lg w-full transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               border border-red-200 hover:border-red-300"
                  >
                    <div className="p-1.5 bg-red-50 rounded-md">
                      <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-pulse' : ''}`} />
                    </div>
                    <span className="font-medium text-sm">
                      {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </span>
                    {isLoggingOut && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="ml-auto w-4 h-4 border-2 border-red-600 border-t-transparent 
                                   rounded-full"
                      />
                    )}
                  </motion.button>
                </motion.div>
                
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}