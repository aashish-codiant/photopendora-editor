import Konva from 'konva';

export const generatePreview = (stage: Konva.Stage): string => {
    try {
        // High quality preview, without the background product image if we just want design
        // But for preview usually we want the full view.
        return stage.toDataURL({ 
            pixelRatio: 2, // 2x for retina quality
            mimeType: 'image/png',
            quality: 0.95 
        });
    } catch (err) {
        console.error("Failed to generate preview:", err);
        return "";
    }
};
