import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, X, FileText } from 'lucide-react';

interface BookPdfUploadProps {
  previewName: string | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

const MAX_SIZE_MB = 20;
const ACCEPTED_TYPES = ['application/pdf'];

export default function BookPdfUpload({ previewName, onFileSelect, disabled, error }: BookPdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Format accepté : PDF uniquement';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Taille maximale : ${MAX_SIZE_MB} Mo`;
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
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = () => {
    setLocalError(null);
    onFileSelect(null);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Fichier PDF du livre
        <span className="text-gray-400 font-normal ml-2">(PDF — max {MAX_SIZE_MB} Mo)</span>
      </label>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <AnimatePresence mode="wait">
        {previewName ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex items-center gap-2 border-0 rounded-2xl px-4 py-3 bg-gradient-to-br from-cosmic-purple/10 to-cosmic-indigo/10 shadow-md backdrop-blur"
          >
            <FileText className="w-6 h-6 text-indigo-600" />
            <span className="font-medium text-gray-800 truncate max-w-[180px]">{previewName}</span>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="ml-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                title="Supprimer le PDF"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !disabled && inputRef.current?.click()}
            className={[
              "w-full max-w-[300px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all px-6 py-8 shadow-md backdrop-blur",
              disabled ? "opacity-50 cursor-not-allowed" : "border-cosmic-purple/30 hover:border-cosmic-indigo/60 hover:bg-cosmic-purple/10"
            ].join(" ")}
          >
            <FileUp className="w-8 h-8 text-indigo-500" />
            <span className="text-xs text-gray-500 text-center px-2">Cliquez pour sélectionner un PDF</span>
          </motion.div>
        )}
      </AnimatePresence>

      {displayError && (
        <p className="mt-1 text-sm font-semibold text-red-600 drop-shadow">{displayError}</p>
      )}
    </div>
  );
}