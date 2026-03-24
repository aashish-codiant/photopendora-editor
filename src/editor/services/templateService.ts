import type { ProductTemplate } from "../types/template";


export const loadProductTemplate = async (productId: string): Promise<ProductTemplate | null> => {
    // Mock template for development. In production, this would call your back-end API.
    return {
        id: `tpl_${productId}`,
        productId: productId,
        canvasWidth: 800,
        canvasHeight: 600,
        baseImage: 'https://images.unsplash.com/photo-1549416878-b9ca35c2d4ac?q=80&w=1000&auto=format&fit=crop', // A placeholder necklace/product image
        personalizationArea: {
            x: 200,
            y: 150,
            width: 400,
            height: 300,
        },
        allowedFonts: [], // empty means all
        allowedAssets: [],
        allowedDesigns: [],
        maxTextElements: 5,
        maxCharacters: 50,
    };
};


  