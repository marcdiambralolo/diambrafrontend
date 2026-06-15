export type DateLike = Date | string | number | null | undefined;

export interface ValidationMessage {
  text: string;
  type: 'success' | 'error';
}