import { api } from "@/lib/api/client";
import endpoints from "@/lib/api/endpoints";
import type { Book } from '@/lib/interfaces';

type BooksResponse = Book[] | { books?: Book[] };
type BookResponse = Book | { book?: Book | null };
type BookPurchaseResponse = {
  success?: boolean;
  message?: string;
  purchased?: boolean;
};

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
}

export interface PurchaseBookWithOfferingPayload {
  offeringId: string;
  category: string;
  quantity: number;
}

export interface PurchaseBookWithOfferingResult {
  success: boolean;
  purchased: boolean;
  message: string;
}

export async function createBook(data: BookFormData): Promise<Book | null> {
  const res = await api.post<BookResponse>("/admin/books", data);
  return normalizeBookResponse(res.data);
}

function normalizeBooksResponse(data: BooksResponse): Book[] {
  if (Array.isArray(data)) return data as Book[];

  if (Array.isArray(data.books)) {
    return data.books;
  }

  return [];
}

function normalizeBookResponse(data: BookResponse): Book | null {
  if (!data || typeof data !== 'object') return null;

  if ('book' in data) {
    return data.book ?? null;
  }

  return data as Book;
}

export async function getBooks(): Promise<Book[]> {
  const res = await api.get<BooksResponse>('/books');
  return normalizeBooksResponse(res.data);
}

export async function getBookById(id: string): Promise<Book | null> {
  const res = await api.get<BookResponse>(`/books/${id}`);
  return normalizeBookResponse(res.data);
}

export async function updateBook(id: string, data: BookFormData): Promise<Book | null> {
  const res = await api.patch<BookResponse>(endpoints.adminBooks.byId(id), data);
  return normalizeBookResponse(res.data);
}

export async function purchaseBookWithOffering(
  bookId: string,
  data: PurchaseBookWithOfferingPayload,
): Promise<PurchaseBookWithOfferingResult> {
  const response = await api.post<BookPurchaseResponse>(`books/${bookId}/purchase`, data);

  return {
    success: response.data?.success === true,
    purchased: response.data?.purchased === true,
    message: response.data?.message || '',
  };
}
