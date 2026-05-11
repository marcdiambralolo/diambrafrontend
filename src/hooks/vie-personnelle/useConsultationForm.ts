import { useMemo, useCallback, type ChangeEvent } from 'react';
import { birthCountries } from '@/lib/birthCountries';

type ConsultationFormState = {
  paysNaissance?: string;
};

type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

type CitySelection = {
  cityName: string;
  countryName?: string;
};

export function useConsultationForm(form: ConsultationFormState, handleChange: (e: FormChangeEvent) => void) {
  const countryOptions = useMemo(() => ['', ...birthCountries], []);

  const onChangeField = useCallback(
    (name: string, value: string) => { handleChange({ target: { name, value } } as unknown as FormChangeEvent); },
    [handleChange]
  );

  const cityApiUrl = useMemo(() => '/api/cities', []);
  // Utilise la clé d'API ville fournie par l'utilisateur (via variable d'env Next.js)
  const cityApiKey = useMemo(() => process.env.NEXT_PUBLIC_CITY_API_KEY || '', []);

  const handleCitySelect = useCallback(
    (c: CitySelection) => {
      onChangeField('villeNaissance', c.cityName);
      if (!form.paysNaissance && c.countryName) {
        onChangeField('paysNaissance', c.countryName);
      }
    },
    [form.paysNaissance, onChangeField]
  );

  return { countryOptions, cityApiUrl, cityApiKey, onChangeField, handleCitySelect };
}