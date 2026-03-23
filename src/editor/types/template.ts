export const Platform = {
    SHOPIFY: "shopify.com",
    ETSY: "etsy.com",
} as const;

export type Platform = typeof Platform[keyof typeof Platform];

export interface PersonalizationArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Design {
    id: string;
    name: string;
    image: string;
    productId: string;
}

export interface ProductTemplate {
    id: string;
    productId: string;
    canvasWidth: number;
    canvasHeight: number;
    baseImage: string;
    personalizationArea: PersonalizationArea;
    allowedFonts: string[];
    allowedAssets: string[];
    allowedDesigns: Design[];
    maxTextElements: number;
    maxCharacters: number;
}
