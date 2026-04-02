import type { Variant } from "./varinat.type";

export interface Product {
    id: string;
    title: string;
    handle: string;
    featureImage: string;
    price: number;
    currencyCode: string;
    createdAt: string;
    updatedAt: string;
    variants: Variant[];
}