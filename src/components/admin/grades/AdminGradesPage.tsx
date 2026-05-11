'use client';
import { useAdminGradesPage } from '@/hooks/admin/grades/useAdminGradesPage';
import Banner from './Banner';
import GradesList from './GradesList';
import ReloadButtons from './ReloadButtons';
import TopBar from './TopBar';
import { motion } from 'framer-motion';

export default function AdminGradesPage() {
  const {
    gradeConfigs, gradesLoading, gradesError, banner, gradesById, editingId,
    fetchGrades, updateGrade, startEdit, stopEdit,
  } = useAdminGradesPage();

  return (
    <motion.main
      className="w-full mx-auto max-w-6xl px-2 sm:px-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
      aria-label="Gestion des grades"
    >
      <TopBar />

      <section aria-labelledby="grades-title" className="mt-2">
        <h1 id="grades-title" className="text-2xl font-bold text-[#2E5AA6] dark:text-[#9BC2FF] mb-4">
          Gestion des grades
        </h1>

        <ReloadButtons
          fetchGrades={fetchGrades}
          gradesLoading={gradesLoading}
        />

        <Banner banner={banner} />

        {gradesError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800" role="alert" aria-live="assertive">
            {gradesError}
          </div>
        )}

        <GradesList
          gradeConfigs={gradeConfigs}
          gradesLoading={gradesLoading}
          editingId={editingId}
          startEdit={startEdit}
          stopEdit={stopEdit}
          updateGrade={updateGrade}
          gradesById={gradesById}
        />
      </section>
    </motion.main>
  );
}