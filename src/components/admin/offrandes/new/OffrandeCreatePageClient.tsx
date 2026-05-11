"use client";
import { OfferingForm } from "@/components/admin/offrandes/new/OfferingForm";
import { useOfferingForm } from "@/hooks/admin/offrandes/useOfferingForm";

export default function OffrandeCreatePageClient() {
  const {
   illustrationFile, formData, saving, error, priceUSD, handleChange, handleCategoryChange, handleSubmit, handleCancel,
    handleFileChange,  setIllustrationFile
  } = useOfferingForm();

  return (
    <div className="w-full flex items-center justify-center relative z-10 animate-fade-in">
      <OfferingForm
        formData={formData}
        error={error}
        saving={saving}
        priceUSD={priceUSD}
        onChange={handleChange}
        onCategoryChange={handleCategoryChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        handleFileChange={handleFileChange}
        illustrationFile={illustrationFile}
        setIllustrationFile={setIllustrationFile}
      />
    </div>
  );
}