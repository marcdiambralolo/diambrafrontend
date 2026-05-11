'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import React, { Component, memo, ReactNode } from 'react';
import { containerVariants, pulseVariants } from '../commons/errorBoundaryVariants';

interface OrbitingStarProps {
  delay: number;
  duration: number;
  radius: number;
}

const OrbitingStarComponent = ({ delay, duration, radius }: OrbitingStarProps) => {

  return (
    <motion.div
      initial={{ rotate: delay * 120 }}
      animate={{ rotate: delay * 120 + 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        delay
      }}
      className="absolute inset-0 pointer-events-none"
    >
      <div
        className="absolute left-1/2 top-1/2 w-2 h-2 bg-yellow-300 rounded-full shadow-lg 
                   shadow-yellow-300/50"
        style={{
          transform: `translate(-50%, -50%) translateX(${radius}px)`
        }}
      />
    </motion.div>
  );
};

export const OrbitingStar = memo(OrbitingStarComponent, (prev, next) => {
  return prev.duration === next.duration && prev.radius === next.radius;
});

interface FloatingParticleProps {
  delay: number;
  x: string;
  y: string;
}

const FloatingParticleComponent = ({ delay, x, y }: FloatingParticleProps) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        y: [0, -20, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      className="absolute h-1 w-1 rounded-full bg-[#9BC2FF] sm:h-1.5 sm:w-1.5"
      style={{ left: x, top: y }}
    />
  );
};

export const FloatingParticle = memo(FloatingParticleComponent, (prev, next) => {
  return prev.x === next.x && prev.y === next.y;
});

const LoadingFallbackComponent = () => {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 
                    bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56] 
                    overflow-hidden relative">
      <motion.div
        className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-64 h-64 sm:w-96 sm:h-96 
                   bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 sm:-bottom-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 
                   bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />

      <FloatingParticle delay={0} x="10%" y="20%" />
      <FloatingParticle delay={0.5} x="90%" y="30%" />
      <FloatingParticle delay={1} x="20%" y="70%" />
      <FloatingParticle delay={1.5} x="80%" y="60%" />
      <FloatingParticle delay={2} x="50%" y="15%" />
      <FloatingParticle delay={2.5} x="40%" y="85%" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 200,
          damping: 20
        }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="relative mx-auto mb-6 sm:mb-8 w-32 h-32 sm:w-40 sm:h-40">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              <Sparkles className="h-12 w-12 text-[#9BC2FF] sm:h-16 sm:w-16"
                strokeWidth={1.5} />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#4F83D1] blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-0 rounded-full border-4 border-[#4F83D1]/20 border-t-[#4F83D1] 
                     rounded-full"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-2 rounded-full border-4 border-[#9BC2FF]/20 border-b-[#9BC2FF] 
                     rounded-full"
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-4 border-4 border-indigo-400/30 border-r-indigo-400 
                     rounded-full"
          />

          <OrbitingStar delay={0} duration={4} radius={60} />
          <OrbitingStar delay={1} duration={5} radius={70} />
          <OrbitingStar delay={2} duration={6} radius={55} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              backgroundImage: 'linear-gradient(90deg, #fff, #4F83D1, #9BC2FF, #fff)',
              backgroundSize: '200% 100%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Mon Etoile
          </motion.h2>

          <motion.p
            className="text-sm font-medium text-[#DDE7FA] sm:text-base"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            Consultation des astres en cours...
          </motion.p>

          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-[#4F83D1] sm:h-2.5 sm:w-2.5"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 sm:mt-10 space-y-2"
        >
          {[
            { icon: '🌙', text: 'Analyse des phases lunaires', delay: 0 },
            { icon: '⭐', text: 'Calcul des positions planétaires', delay: 0.3 },
            { icon: '✨', text: 'Préparation de votre guidance', delay: 0.6 }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: step.delay,
                duration: 0.5,
                type: 'spring',
                stiffness: 300
              }}
              className="flex items-center justify-center gap-2 text-xs text-[#9BC2FF] sm:text-sm"
            >
              <motion.span
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: step.delay
                }}
              >
                {step.icon}
              </motion.span>
              <span>{step.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error :', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center 
                        bg-gradient-to-br from-[#EEF4FF] to-[#DDE7FA] 
                        dark:from-[#070B1A] dark:to-[#0F1C3F] p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 
                       rounded-2xl p-8 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Une erreur est survenue
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nous nous excusons pour ce désagrément. Une erreur inattendue s'est produite.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                           rounded-lg p-4 mb-4 max-h-48 overflow-y-auto"
              >
                <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-xs mt-2 text-red-700 dark:text-red-400 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={this.handleReset}
              className="w-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] 
                         hover:from-[#244A8A] hover:to-[#3E6FB5]  text-white 
                         font-semibold py-3 px-6 rounded-lg 
                         transition-all duration-200 shadow-lg 
                         hover:shadow-xl focus:outline-none focus:ring-2 
                         focus:ring-[#2E5AA6] focus:ring-offset-2"
            >
              Réessayer
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const LoadingFallback = memo(LoadingFallbackComponent, () => true);