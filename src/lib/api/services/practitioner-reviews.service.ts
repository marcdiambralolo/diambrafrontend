import { api } from '../client';

export interface CreatePractitionerReviewDto {
  consultationId: string;
  comment: string;
  rating: number;
}

export const practitionerReviewsService = {
  async createReview(data: CreatePractitionerReviewDto) {
    const response = await api.post('/practitioner-reviews', data);
    return response.data;
  },
  async getByConsultation(consultationId: string): Promise<import("@/lib/interfaces").PractitionerReview[]> {
    const response = await api.get(`/practitioner-reviews/by-consultation/${consultationId}`);
    return response.data as import("@/lib/interfaces").PractitionerReview[];
  },
  async getByUser(userId: string) {
    const response = await api.get(`/practitioner-reviews/by-user/${userId}`);
    return response.data;
  },
};
