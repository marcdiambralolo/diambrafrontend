'use client';
import { motion } from 'framer-motion';
import DomaineCard from '@/components/admin/rubriques/overview/DomaineCard';

type DomaineCardProps = React.ComponentProps<typeof DomaineCard>['domaine'];

export function DomaineList({ domaines, }: { domaines: DomaineCardProps[]; }) {

  return (
    <div className="space-y-6">
      {domaines.map((domaine, dIndex: number) => (
        <motion.div
          key={`domaine-${domaine.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + dIndex * 0.1 }}
        >
          <DomaineCard domaine={domaine} />
        </motion.div>
      ))}
    </div>
  );
}