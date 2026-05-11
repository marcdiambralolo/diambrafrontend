import { useMemo, useCallback, type ChangeEvent } from 'react';
import { birthCountries } from '@/lib/birthCountries';
import { TierceItem } from '@/lib/interfaces';

interface ConsultationForm {
  paysNaissance?: string;
  [key: string]: string | undefined;
}

interface UseConsultationFormGroupeProps {
  form: ConsultationForm;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  tiercesList: TierceItem[];
  maxTierces: number;
  showAddMore: boolean;
  setShowAddMore: (show: boolean) => void;
  handleAddTierce: () => boolean | void;
  handleRemoveTierce: (id: string) => void;
}

export function useConsultationFormGroupe({
  form,
  handleChange,
  tiercesList,
  maxTierces,
  showAddMore,
  setShowAddMore,
  handleAddTierce,
  handleRemoveTierce,
}: UseConsultationFormGroupeProps) {
  const countryOptions = useMemo(() => ['', ...birthCountries], []);
  const cityApiUrl = '/api/cities';
  const cityApiKey = process.env.NEXT_PUBLIC_CITY_API_KEY || '';

  const hasTierces = tiercesList.length > 0;
  const canAddMore = tiercesList.length < maxTierces;
  const showTierceForm = showAddMore || !hasTierces;

  const onChangeField = useCallback(
    (name: string, value: string) => {
      handleChange({ target: { name, value } } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>);
    },
    [handleChange]
  );

  const handleCitySelect = useCallback(
    (c: { cityName: string; countryName?: string }) => {
      onChangeField('villeNaissance', c.cityName);
      if (!form.paysNaissance && c.countryName) {
        onChangeField('paysNaissance', c.countryName);
      }
    },
    [form.paysNaissance, onChangeField]
  );

  const handleAddTierceWrapper = useCallback(async (): Promise<boolean> => {
    const result = handleAddTierce();
    return typeof result === 'boolean' ? result : false;
  }, [handleAddTierce]);

  const onClickAddMore = useCallback(() => setShowAddMore(true), [setShowAddMore]);
  const onClickCancelAddMore = useCallback(() => setShowAddMore(false), [setShowAddMore]);
  const onRemove = useCallback(handleRemoveTierce, [handleRemoveTierce]);

  const tiercesCountLabel = useMemo(
    () => `Personnes tierces enregistrées (${tiercesList.length})`,
    [tiercesList.length],
  );

  return {
    handleCitySelect, handleAddTierceWrapper, onClickAddMore, onRemove, onChangeField,
    onClickCancelAddMore, hasTierces, canAddMore, showTierceForm, cityApiUrl, cityApiKey, countryOptions, tiercesCountLabel,
  };
}