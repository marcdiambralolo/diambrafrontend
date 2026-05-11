
import { api } from '@/lib/api/client';

export interface BlogArticle {
  _id: string;
  title: string;
  content: string;
  illustrationUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogArticleDto {
  title: string;
  content: string;
  published?: boolean;
}

export interface BlogListResponse {
  data: BlogArticle[];
  total: number;
  page: number;
  limit: number;
}

export const blogService = {
  // Récupérer tous les articles paginés
  async getAll(page = 1, limit = 6): Promise<BlogListResponse> {
    const res = await api.get<BlogListResponse>(`/blog?page=${page}&limit=${limit}`);
    return res.data;
  },

  // Récupérer un article par ID
  async getById(id: string): Promise<BlogArticle> {
    const res = await api.get<BlogArticle>(`/blog/${id}`);
    // Log de la réponse brute pour debug
    // eslint-disable-next-line no-console
     return res.data;
  },

  // Créer un nouvel article (admin)
  async create(data: BlogArticleDto, illustration?: File): Promise<BlogArticle> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (typeof data.published !== 'undefined') {
      formData.append('published', String(data.published));
    }
    if (illustration) {
      formData.append('illustration', illustration);
    }
    const res = await api.post<BlogArticle>('/blog', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Modifier un article (admin)
  async update(id: string, data: Partial<BlogArticleDto>, illustration?: File): Promise<BlogArticle> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.content) formData.append('content', data.content);
    if (typeof data.published !== 'undefined') {
      formData.append('published', String(data.published));
    }
    if (illustration) {
      formData.append('illustration', illustration);
    }
    const res = await api.put<BlogArticle>(`/blog/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Supprimer un article (admin)
  async delete(id: string): Promise<void> {
    await api.delete(`/blog/${id}`);
  },
};
