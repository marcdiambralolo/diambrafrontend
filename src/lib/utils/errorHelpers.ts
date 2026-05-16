export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message || fallback; if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null) {
    const maybeResponse = error as { response?: { data?: { message?: string } } };
    return maybeResponse.response?.data?.message || fallback;
  }

  return fallback;
}