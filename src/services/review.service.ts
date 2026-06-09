import { createCrudService } from "@/services/crud-service";

export type ReviewServiceItem = {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  content: string;
};

const service = createCrudService<ReviewServiceItem>("/reviews");

export const reviewService = {
  listReviews: service.list,
  getReviewById: service.getById,
  createReview: service.create,
  updateReview: service.update,
  deleteReview: service.remove,
};

