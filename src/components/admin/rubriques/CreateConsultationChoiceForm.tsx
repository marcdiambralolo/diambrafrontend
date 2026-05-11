"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { addConsultationChoiceToRubrique } from "@/lib/api/services/rubriques.service";
import InputField from "@/components/commons/InputField";

export default function CreateConsultationChoicePage() {
  const router = useRouter();
  const params = useParams();
  const rubriqueId = params?.id as string;
  alert(rubriqueId);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addConsultationChoiceToRubrique(rubriqueId, { label, description });
      router.push(`/admin/rubriques/${rubriqueId}`);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'ajout du choix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-cosmic-indigo">Ajouter un choix de consultation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Intitulé du choix"
          name="label"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Ex : Consultation Amour"
        />
        <InputField
          label="Description"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Décrivez ce choix de consultation"
        />
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl px-5 py-3 font-bold text-white bg-gradient-to-r from-cosmic-indigo to-cosmic-purple shadow-lg hover:from-cosmic-purple hover:to-cosmic-indigo transition-all duration-300"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );


  
}
