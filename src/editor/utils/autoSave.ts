import type { Element } from "../types/element";

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const autoSaveDesign = (designId: string, elements: Element[]) => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
        const designData = {
            id: designId,
            elements,
            updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem(`design_${designId}`, JSON.stringify(designData));
        console.log(`[Autosave] Saved design ${designId} to localStorage`);
    }, 1000);
};
