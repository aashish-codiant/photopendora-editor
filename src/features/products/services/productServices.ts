import axios from "axios";
import type { Product } from "../types/product.types";
import type { Variant } from "../types/varinat.type";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);
        if (response.data.success) {
            return response.data.data.products;
        }
        throw new Error(response.data.error);
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getProductById = async (id: string): Promise<Product> => {
    try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.error);
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

export const updateProduct = async (id: string, product: Product): Promise<Product> => {
    try {
        const response = await axios.put(`${API_URL}/api/products/${id}`, product);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.error);
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const updateVariant = async (id: string, variant: Variant): Promise<Variant> => {
    try {
        const response = await axios.put(`${API_URL}/api/products/${id}/variants/${variant.id}`, variant);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.error);
    } catch (error) {
        console.error("Error updating variant:", error);
        throw error;
    }
};