import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface Review {
    _id: string;
    userId: {
        _id: string;
        username: string;
        avatar?: string;
    };
    productId: string;
    orderId: string;
    rating: number;
    comment: string;
    images: string[];
    createdAt: string;
    selectedColor?: string;
    selectedSize?: string;
}

export interface ProductReviewsResponse {
    success: boolean;
    reviews: Review[];
    avgRating: number;
    total: number;
}

export const ReviewService = {
    async getProductReviews(productId: string): Promise<ProductReviewsResponse> {
        const response = await axios.get(`${API_URL}/api/reviews/product/${productId}`);
        return response.data;
    },

    async checkReviewExists(productId: string, orderId: string) {
        const response = await axios.get(`${API_URL}/api/reviews/check`, {
            params: { productId, orderId }
        });
        return response.data;
    }
};
