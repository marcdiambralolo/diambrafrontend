import { CategorieAdmin } from '@/lib/interfaces';
import { api } from '@/lib/api/client';

type RawRubrique = {
  id?: string;
  _id?: string;
  titre?: string;
  nom?: string;
  description?: string;
  categorieId?: string;
};

type RawCategory = {
  id?: string;
  _id?: string;
  titre?: string;
  nom?: string;
  description?: string;
  rubriques?: RawRubrique[];
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryMutationPayload = {
  nom: string;
  description: string;
  rubriques: string[];
};

type CategoryResponse = RawCategory | { data?: RawCategory };
type CategoriesResponse = RawCategory[] | { data?: RawCategory[] };

function extractCategoryData(response: CategoryResponse): RawCategory {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return response.data ?? {};
  }

  return response as RawCategory;
}

function extractCategoriesData(response: CategoriesResponse): RawCategory[] {
  if (Array.isArray(response)) {
    return response;
  }

  return Array.isArray(response.data) ? response.data : [];
}

const normalizeCategory = (d: RawCategory): CategorieAdmin => ({
  _id: d?.id || d?._id,
  nom: d?.titre || d?.nom,
  description: d?.description,
  rubriques: (d?.rubriques || []).map((r) => ({
    _id: r?.id || r?._id,
    titre: r?.titre || r?.nom,
    description: r?.description,
    categorieId: r?.categorieId,
  })),
  createdAt: d?.createdAt,
  updatedAt: d?.updatedAt,
} as CategorieAdmin);

export async function getCategory(id: string): Promise<CategorieAdmin> {
  let res;
  try {
    res = await api.get<CategoryResponse>(`/categories/${id}/with-rubriques`);
  } catch {
    res = await api.get<CategoryResponse>(`/categories/${id}`);
  }
  // Adapter la structure backend à l'interface attendue côté front
  const d = extractCategoryData(res.data);
  return normalizeCategory(d);
}

export async function getCategories(): Promise<CategorieAdmin[]> {
  const res = await api.get<CategoriesResponse>('/categories');
  return extractCategoriesData(res.data).map(normalizeCategory);
}

export async function createCategory(data: CategoryMutationPayload): Promise<unknown> {
  const res = await api.post<unknown>('/categories', data);
  return res.data;
}

export async function updateCategory(id: string, data: CategoryMutationPayload): Promise<unknown> {
  const res = await api.patch<unknown>(`/categories/${id}`, data);
  return res.data;
} 