'use client';

import { MEDIUM_DOMAINS, MEDIUM_METHODS, MEDIUM_SPECIALTIES, mediumTermsSections, useMediumInscription } from '@/hooks/medium/useMediumInscription';
import { cx } from '@/lib/functions';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BookOpen, ImagePlus, Loader2, Shield, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import React, { memo, useCallback, useRef, useState } from 'react';

// Lazy loading des composants lourds
const LazyBookCoverUpload = memo(({ previewUrl, onFileSelect, disabled, error }: {
  previewUrl: string | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const MAX_SIZE_MB = 5;
  const ACCEPTED_TYPES = React.useMemo(() => [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'image/bmp',
    'image/gif',
  ], []);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Format accepté : JPG, PNG, WebP, BMP ou GIF';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Taille maximale : ${MAX_SIZE_MB} Mo`;
    }
    return null;
  }, [ACCEPTED_TYPES]);

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [handleFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setLocalError(null);
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div className="relative">
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
            className="relative w-full max-w-[200px] aspect-[3/4] rounded-2xl overflow-hidden border-0 shadow-xl shadow-cosmic-indigo/20 group bg-gradient-to-br from-cosmic-purple/10 to-cosmic-indigo/10 backdrop-blur-sm"
          >
            <Image
              src={previewUrl}
              alt="Aperçu"
              fill
              sizes="200px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized={previewUrl.startsWith('blob:') || previewUrl.startsWith('data:')}
              loading="lazy"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-3">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-cosmic-indigo/10 transition-colors"
                    title="Changer l'image"
                  >
                    <ImagePlus className="w-5 h-5 text-cosmic-indigo" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-cosmic-purple/10 transition-colors"
                    title="Supprimer"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && inputRef.current?.click()}
            className={cx(
              "relative w-full max-w-[200px] aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 overflow-hidden",
              dragActive
                ? "border-cosmic-indigo bg-gradient-to-br from-cosmic-indigo/20 to-cosmic-purple/20 shadow-lg"
                : "border-cosmic-purple/40 hover:border-cosmic-indigo/60 hover:bg-gradient-to-br hover:from-cosmic-purple/5 hover:to-cosmic-indigo/5",
              disabled ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/5 to-cosmic-indigo/5 rounded-2xl" />
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cosmic-purple/20 to-cosmic-indigo/20">
              <BookOpen className="w-7 h-7 text-cosmic-indigo" />
            </div>
            <span className="relative z-10 text-xs font-medium text-gray-600 dark:text-gray-400 text-center px-3">
              {dragActive ? '✨ Déposez ici ✨' : '📸 Cliquez ou glissez une image'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {displayError && (
        <p className="mt-2 text-sm font-semibold text-red-500">{displayError}</p>
      )}
    </div>
  );
});

// Compteur de caractères optimisé
const CharCounter = memo(({ length, max }: { length: number; max: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full transition-all ${length > max * 0.9 ? 'bg-red-500' : length > max * 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`}
        initial={{ width: 0 }}
        animate={{ width: `${(length / max) * 100}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
    <span className={`text-xs font-mono ${length > max * 0.9 ? 'text-red-500' : length > max * 0.7 ? 'text-yellow-600' : 'text-gray-500'}`}>
      {length}/{max}
    </span>
  </div>
));

// Section des conditions - version optimisée sans animation intrusive
const TermsSection = memo(({ section }: { section: typeof mediumTermsSections[0]; index: number }) => (
  <div className="group mb-6 last:mb-0">
    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
      <Shield className="w-4 h-4 text-indigo-600" />
      {section.title}
    </h3>
    {section.intro && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{section.intro}</p>}
    {section.items && (
      <ul className="mt-2 space-y-1 pl-6">
        {section.items.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 list-disc">
            {item}
          </li>
        ))}
      </ul>
    )}
    {section.footer && <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-500">{section.footer}</p>}
  </div>
));

export default function MediumInscriptionPage() {

  const {
    form, isClient, loading, success, hasAcceptedTerms,
    termsAccepted, photoPreview, posterPreview, error, isSubmitting,
    handleChange, handleSubmit, handleSelectChange, toggleArrayField,
    handlePhotoSelect, handlePosterSelect, setTermsAccepted, handleContinue,
  } = useMediumInscription();

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden py-12 md:py-16">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Rejoignez notre communauté d'experts</span>
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            S'inscrire en tant que consultant
          </motion.h1>

          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Rejoignez la plateforme Mon Étoile et offrez vos services à des milliers de personnes en quête de guidance.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          {success && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
              <h2 className="text-xl font-bold text-emerald-800 mb-2">✨ Candidature envoyée ! ✨</h2>
              <p className="text-emerald-700">
                Merci pour votre inscription. Notre équipe examinera votre candidature dans les plus brefs délais.
              </p>
            </motion.div>
          )}

          {!hasAcceptedTerms ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Bloc des conditions - scrollable sans être coupé */}
              <div className="rounded-2xl border border-indigo-200 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 sticky top-0 bg-white pt-0 pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Règlements et conditions générales</h2>
                </div>

                <div className="pr-4 space-y-6">
                  {mediumTermsSections.map((section, idx) => (
                    <TermsSection key={section.title} section={section} index={idx} />
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Je reconnais avoir lu et accepté le règlement et les conditions générales de <span className="font-bold">MON ÉTOILE</span>.
                </span>
              </label>

              {/* Bouton continuer */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                disabled={!termsAccepted}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" />
                  Je continue
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <form className="w-full space-y-6" onSubmit={handleSubmit}>


              {/* Section Photo avec animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-cosmic-purple/5 to-cosmic-indigo/5 rounded-2xl p-6"
              >
                <label className="mb-3 block font-bold text-lg">
                  Photo de profil <span className="text-red-500">*</span>
                </label>
                <LazyBookCoverUpload
                  previewUrl={photoPreview}
                  onFileSelect={handlePhotoSelect}
                  error={!form.photo && !loading ? 'Photo requise' : undefined}
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-500">Format : JPG, PNG, WebP. Photo claire du visage.</p>
              </motion.div>

              {/* Présentation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              >
                {/* Champ nom du consultant */}
                <label className="mb-2 block font-bold text-gray-900">Nom du consultant <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nomconsultant"
                  value={form.nomconsultant || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition-all focus:border-indigo-300 focus:bg-white mb-4"
                  placeholder="Votre nom"
                  required
                  maxLength={80}
                />
                <label className="mb-2 block font-bold text-gray-900">✨ À propos de moi</label>
                <textarea
                  name="presentation"
                  value={form.presentation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-300 focus:bg-white"
                  placeholder="Décrivez votre parcours, vos dons, vos formations..."
                  rows={4}
                  required
                  maxLength={900}
                />
                <CharCounter length={form.presentation.length} max={900} />
              </motion.div>

              {/* Spécialités */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              >
                <label className="mb-3 block font-bold text-gray-900">
                  🔮 Spécialités <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MEDIUM_SPECIALTIES.map((spec) => (
                    <label key={spec} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.specialties.includes(spec)}
                        onChange={(e) => toggleArrayField('specialties', spec, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
                <input
                  name="specialtyOther"
                  value={form.specialtyOther}
                  onChange={handleChange}
                  type="text"
                  className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-300"
                  placeholder="Autre spécialité (précisez)"
                />
                {form.specialties.length === 0 && !loading && (
                  <p className="mt-2 text-sm text-red-500">Veuillez sélectionner au moins une spécialité.</p>
                )}
              </motion.div>

              {/* Domaines */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              >
                <label className="mb-3 block font-bold text-gray-900">
                  🎯 Domaines de consultation <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MEDIUM_DOMAINS.map((domain) => (
                    <label key={domain} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.domains.includes(domain)}
                        onChange={(e) => toggleArrayField('domains', domain, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{domain}</span>
                    </label>
                  ))}
                </div>
                {form.domains.length === 0 && !loading && (
                  <p className="mt-2 text-sm text-red-500">Veuillez sélectionner au moins un domaine.</p>
                )}
              </motion.div>

              {/* Méthodes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              >
                <label className="mb-3 block font-bold text-gray-900">💬 Méthodes de consultation</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MEDIUM_METHODS.map((method) => (
                    <label key={method} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.methods.includes(method)}
                        onChange={(e) => toggleArrayField('methods', method, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Expérience et Téléphone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
                >
                  <label className="mb-2 block font-bold text-gray-900">📅 Années d'expérience</label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleSelectChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-300"
                  >
                    <option value="">Sélectionner</option>
                    <option value="1-3">1 à 3 ans</option>
                    <option value="3-5">3 à 5 ans</option>
                    <option value="5-10">5 à 10 ans</option>
                    <option value="10-20">10 à 20 ans</option>
                    <option value=">20">Plus de 20 ans</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
                >
                  <label className="mb-2 block font-bold text-gray-900">
                    📞 Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-300"
                    placeholder="Votre numéro de téléphone"
                    required
                  />
                </motion.div>
              </div>
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="mb-3 block font-bold">🎨 Affiche de présentation</label>
                <LazyBookCoverUpload
                  previewUrl={posterPreview}
                  onFileSelect={handlePosterSelect}
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-500">Image d'affiche ou flyer (optionnel)</p>
              </motion.div>


              {/* Vidéo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              >
                <label className="mb-2 block font-bold text-gray-900">🎥 Vidéo de présentation</label>
                <input
                  name="video"
                  value={form.video}
                  onChange={handleChange}
                  type="url"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-indigo-300"
                  placeholder="Lien YouTube, TikTok, etc."
                />
                <p className="mt-1 text-xs text-gray-400">Augmente la confiance des clients ✨</p>
              </motion.div>

              {/* Bouton de soumission */}
              <motion.button
                type="submit"
                disabled={loading || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-md overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading || isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Envoyer ma candidature
                    </>
                  )}
                </span>
              </motion.button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Styles pour la scrollbar personnalisée */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
      `}</style>
    </main>
  );
}