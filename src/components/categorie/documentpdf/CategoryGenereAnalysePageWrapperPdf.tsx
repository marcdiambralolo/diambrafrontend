'use client';
import CategoryLoadingSpinner from '@/components/categorie/commons/CategoryLoadingSpinner';
import { useConsultationPdf } from '@/hooks/categorie/documentpdf/useConsultationPdf';
import { AnimatePresence, motion,Variants  } from 'framer-motion';
import { AlertTriangle, BookOpen, CheckCircle, Download, Eye, Sparkles } from 'lucide-react';
import { useState } from 'react';

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const scaleOnHover: Variants = {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
};

function ErrorStatePdf({ error }: { error: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4"
        >
            <div className="max-w-md w-full rounded-xl bg-white border border-gray-100 p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                    <AlertTriangle className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Document indisponible</h3>
                <p className="text-sm text-gray-500">{error}</p>
            </div>
        </motion.div>
    );
}

function SuccessToast({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 shadow-md"
        >
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Téléchargement lancé !</span>
            <button onClick={onClose} className="text-emerald-500 hover:text-emerald-700">
                ✕
            </button>
        </motion.div>
    );
}

export default function CategoryGenereAnalysePageWrapperPdf() {
    const { handleDownload, loading, error, pdfUrl } = useConsultationPdf();
    const [showSuccess, setShowSuccess] = useState(false);

    const onDownload = async () => {
        await handleDownload();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    if (loading) return <CategoryLoadingSpinner />;
    if (error) return <ErrorStatePdf error={error} />;

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
            <AnimatePresence>
                {showSuccess && <SuccessToast onClose={() => setShowSuccess(false)} />}
            </AnimatePresence>
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="bg-gray-50 border-b border-gray-100 p-2 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                        <BookOpen className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Télécharger votre document</h2>
                    <p className="mt-1 text-sm text-gray-500">Format PDF  </p>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-3">
                        <motion.button
                            {...scaleOnHover}
                            type="button"
                            onClick={onDownload}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all"
                        >
                            <Download className="h-4 w-4" />
                            Télécharger le PDF
                        </motion.button>

                        <motion.a
                            {...scaleOnHover}
                            href={pdfUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            <Eye className="h-4 w-4" />
                            Ouvrir dans le navigateur
                        </motion.a>
                    </div>

                    <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                        <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5" />
                            <p className="text-xs text-amber-700">
                                Astuce : si le téléchargement direct ne fonctionne pas, ouvrez le document dans votre navigateur,
                                puis utilisez les options d'impression ou de sauvegarde de votre lecteur PDF.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
