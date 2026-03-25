import type { ProductTemplate } from "../types/template";
const API_URL = import.meta.env.VITE_API_URL;

export const loadProductTemplate = async (productId: string, variantId?: string | null): Promise<ProductTemplate | null> => {
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}`);
        const result = await response.json();

        if (result.success && result.data) {
            const product = result.data;
            const variant = variantId 
                ? product.variants.find((v: any) => String(v.id).includes(variantId)) || product.variants[0]
                : product.variants[0];

            return {
                id: `tpl_${product.id}`,
                productId: product.id,
                canvasWidth: variant?.canvasWidth || 600,
                canvasHeight: variant?.canvasHeight || 800,
                baseImage: variant?.imageSrc || product.featureImage || '',
                personalizationArea: variant?.personalizationArea || {
                    x: 100,
                    y: 100,
                    width: 400,
                    height: 600,
                },
                allowedFonts: [],
                allowedAssets: [],
                allowedDesigns: [],
                maxTextElements: 5,
                maxCharacters: 50,
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to load product template:", error);
        return null;
    }
};

export const saveDesign = async (designData: {
    productId: string;
    variantId?: string;
    designJson: any;
    previewUrl?: string;
    userId?: string;
    guestId?: string;
    platform?: string;
}) => {
    try {
        const response = await fetch(`${API_URL}/api/save-customization`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(designData),
        });
        const result = await response.json();
        console.log("Design saved result:", result);
        return result;
    } catch (error) {
        console.error("Failed to save design:", error);
        return { success: false, error: "Network error" };
    }
};

  