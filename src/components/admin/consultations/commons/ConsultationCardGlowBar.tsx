import { motion } from 'framer-motion';

export default function ConsultationCardGlowBar({ gradient }: { gradient: string }) {
 
  return (
    <>
      <motion.div
        variants={{ animate: { opacity: [0.7, 1, 0.7], transition: { duration: 2, repeat: Infinity } } }}
        animate="animate"
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        style={{ backgroundSize: '200% 200%' }}
      />
      <motion.div
        variants={{ animate: { opacity: [0.3, 0.7, 0.3], transition: { duration: 2, repeat: Infinity } } }}
        animate="animate"
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} blur-sm`}
        style={{ backgroundSize: '200% 200%' }}
      />
    </>
  );
}
