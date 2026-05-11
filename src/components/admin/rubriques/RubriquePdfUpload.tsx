import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, X, FileText } from 'lucide-react';

interface RubriquePdfUploadProps {
  previewName: string | null;
  onFileSelect: (file: File | null) => void;
  label?: string;
  maxSizeMb?: number;
  showPreviewLink?: boolean;
  fileUrl?: string | null;
}

const DEFAULT_MAX_SIZE_MB = 20;
const ACCEPTED_TYPES = ['application/pdf'];

export default function RubriquePdfUpload({
  previewName,
  onFileSelect,
  label = "PDF associé (optionnel)",
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
  showPreviewLink = false,
  fileUrl = null
}: RubriquePdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Format accepté : PDF uniquement';
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `Taille maximale : ${maxSizeMb} Mo`;
    }
    return null;
  };

  const handleFile = (file: File) => {
    const err = validateFile(file);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('Aucun fichier sélectionné.');
      return;
    }
    handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = () => {
    setLocalError(null);
    onFileSelect(null);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
        <span className="text-gray-400 font-normal ml-2">(PDF — max {maxSizeMb} Mo)</span>
      </label>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="hidden"
        disabled={false}
      />
      <AnimatePresence mode="wait">
        {previewName ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex items-center gap-2 border-2 border-indigo-200 rounded-xl px-4 py-3 bg-white"
          >
            <FileText className="w-6 h-6 text-indigo-600" />
            <span className="font-medium text-gray-800 truncate max-w-[180px]">{previewName}</span>
            {showPreviewLink && fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-700 underline ml-2"
              >
                Voir le PDF
              </a>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="ml-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
              title="Supprimer le PDF"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>

          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            className={`w-full max-w-[300px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all px-6 py-8 border-gray-300 hover:border-indigo-400 hover:bg-gray-50}`}
          >
            <FileUp className="w-8 h-8 text-indigo-500" />
            <span className="text-xs text-gray-500 text-center px-2">Cliquez pour sélectionner un PDF</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}