import { Variants } from "framer-motion";

export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
            mass: 0.5
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

export const shimmerVariants: Variants = {
    animate: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

export const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (delay: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay, type: 'spring', stiffness: 500, damping: 15 }
    })
};

export const glowVariants: Variants = {
    animate: {
        opacity: [0.3, 0.6, 0.3],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export const floatingParticle1Variants: Variants = {
    animate: {
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export const floatingParticle2Variants: Variants = {
    animate: {
        y: [10, -10, 10],
        x: [5, -5, 5],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};