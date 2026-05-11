'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, BookOpen } from 'lucide-react';
import { cx } from '@/lib/functions';

interface BookCoverUploadProps {
  previewUrl: string | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/bmp', 'image/gif'];

export default function BookCoverUpload({ previewUrl, onFileSelect, disabled, error }: BookCoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Format accepté : JPG, PNG, WebP, BMP ou GIF';
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
    // Reset input pour pouvoir re-sélectionner le même fichier
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setLocalError(null);
    onFileSelect(null);
  };

  return (
    <div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-[200px] aspect-[3/4] rounded-2xl overflow-hidden border-0 shadow-lg shadow-cosmic-indigo/10 group bg-gradient-to-br from-cosmic-purple/10 to-cosmic-indigo/10 backdrop-blur"
          >
            <Image
              src={previewUrl}
              alt="Aperçu couverture"
              fill
              sizes="200px"
              className="object-cover"
              unoptimized={previewUrl.startsWith('blob:') || previewUrl.startsWith('data:')}
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="p-2 bg-white/90 rounded-xl shadow hover:bg-cosmic-indigo/10 transition-colors"
                    title="Changer l'image"
                  >
                    <ImagePlus className="w-5 h-5 text-cosmic-indigo" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 bg-white/90 rounded-xl shadow hover:bg-cosmic-purple/10 transition-colors"
                    title="Supprimer l'image"
                  >
                    <X className="w-5 h-5 text-cosmic-purple" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && inputRef.current?.click()}
            className={cx(
              "w-full max-w-[200px] aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-md backdrop-blur",
              dragActive
                ? "border-cosmic-indigo bg-cosmic-indigo/10"
                : "border-cosmic-purple/30 hover:border-cosmic-indigo/60 hover:bg-cosmic-purple/10",
              disabled ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cosmic-purple/20 to-cosmic-indigo/20">
              <BookOpen className="w-6 h-6 text-cosmic-indigo" />
            </div>
            <span className="text-xs text-gray-500 text-center px-2">
              {dragActive ? 'Déposez ici' : 'Cliquez ou glissez une image'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {displayError && (
        <p className="mt-1 text-sm font-semibold text-red-600 drop-shadow">{displayError}</p>
      )}
    </div>
  );
}
