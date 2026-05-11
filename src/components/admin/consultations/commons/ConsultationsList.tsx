'use client';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import ConsultationCard from './ConsultationCard';
import PaginationControls from './PaginationControls';
import { Consultation } from '@/lib/interfaces';

type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

type JobStatusMap = Record<string, { status?: JobStatus }>;

interface ConsultationsListProps {
  consultations: Consultation[];
  onGenerateAnalysis: (id: string) => void;
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  onNotify: (id: string) => void;
  jobStatuses?: JobStatusMap;
  onRetryAnalysis?: (id: string) => void;
}

export const ConsultationsList: React.FC<ConsultationsListProps> = ({
  consultations, loading, currentPage, totalPages, total,
  onPageChange, onGenerateAnalysis, onNotify, jobStatuses, onRetryAnalysis,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full auto-rows-fr">
        <AnimatePresence mode="popLayout">
          {consultations.map((consultation: Consultation) => {
            const consultationId = String(consultation.id ?? consultation._id ?? '');

            return (
              <div key={consultationId} className="relative flex w-full h-full">
                <ConsultationCard
                  consultation={consultation}
                  onGenerateAnalysis={onGenerateAnalysis}
                  onNotify={onNotify}
                  jobStatus={jobStatuses?.[consultationId]?.status ?? null}
                  onRetryAnalysis={onRetryAnalysis}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        itemsPerPage={10}
        onPageChange={onPageChange}
        loading={loading}
      />
    </>
  );
};