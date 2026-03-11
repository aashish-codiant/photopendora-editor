import type { Element } from '../types/element';

interface DesignExport {
    productId: string;
    canvas: {
        width: number;
        height: number;
    };
    elements: Element[];
    exportedAt: string;
}

export const exportDesign = (elements: Element[], productId: string = 'custom-product') => {
    const design: DesignExport = {
        productId,
        canvas: {
            width: 800,
            height: 600
        },
        elements,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-${productId}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
