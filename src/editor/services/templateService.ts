import type { ProductTemplate } from "../types/template";

const MOCK_TEMPLATES: Record<string, ProductTemplate> = {
    "necklace_01": {
        id: "tpl_necklace_01",
        productId: "necklace_01",
        canvasWidth: 800,
        canvasHeight: 600,
        baseImage: "https://images.unsplash.com/photo-1599643478123-dc9171739983?auto=format&fit=crop&q=80&w=800&h=600",
        personalizationArea: {
            x: 200,
            y: 250,
            width: 400,
            height: 120
        },
        allowedFonts: ["Montserrat", "Playfair Display", "Arial"],
        allowedAssets: ["heart", "flower", "crown", "star"],
        maxTextElements: 2,
        maxCharacters: 20
    },
    "tshirt_01": {
        id: "tpl_tshirt_01",
        productId: "tshirt_01",
        canvasWidth: 800,
        canvasHeight: 800,
        baseImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800&h=800",
        personalizationArea: {
            x: 200,
            y: 200,
            width: 400,
            height: 400
        },
        allowedFonts: ["Arial", "Georgia", "Courier New"],
        allowedAssets: ["floral", "banner"],
        maxTextElements: 3,
        maxCharacters: 50
    }
};

export const loadProductTemplate = async (productId: string): Promise<ProductTemplate | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TEMPLATES[productId] || null;
};
