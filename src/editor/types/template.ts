export interface PersonalizationArea {
    x: number;
    y: number;
    width: number;
    height: number;
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
    maxTextElements: number;
    maxCharacters: number;
}
