"use client";
import Loader from '@/app/loading';
import { useRubriqueByIdWithCache } from '@/hooks/cache/useRubriqueByIdWithCache';
import { notFound, redirect } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  id: string;
};

export default function RubriqueRedirectClient({ id }: Props) {
  const { rubrique, isLoading } = useRubriqueByIdWithCache(id);

  useEffect(() => {
    if (!isLoading && rubrique?.categorieId) {
      redirect(`/star/category/${rubrique.categorieId}`);
    }
  }, [rubrique, isLoading]);

  if (!id) { notFound(); }
  if (isLoading) { return <Loader />; }
  if (!rubrique) { notFound(); }

  return <Loader />;
}