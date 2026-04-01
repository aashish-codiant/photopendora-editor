/**
 * Export Image Utility
 * Exports the Konva stage as a high-resolution PNG image.
 * Ensures all fonts are loaded and hides guide elements before export.
 */

import Konva from 'konva';
import { ensureAllFontsLoaded } from './fontLoader';
import { AVAILABLE_FONTS } from '../constants/fonts';
import type { Element } from '../types/element';

/**
 * Build a font-family -> Google Font URL map from AVAILABLE_FONTS
 */
const buildFontMap = (): Map<string, string> => {
    const map = new Map<string, string>();
    AVAILABLE_FONTS.forEach((f) => {
        if (f.googleFontUrl) {
            map.set(f.name, f.googleFontUrl);
        }
    });
    return map;
};

/**
 * Export the Konva stage as a PNG download.
 * - Waits for all fonts used in elements to be fully loaded
 * - Hides guide elements (personalization area rect)
 * - Exports at high pixelRatio for quality
 * - Restores guide elements after export
 */
export const exportStageAsImage = async (
    stage: Konva.Stage,
    elements: Element[],
    options?: {
        pixelRatio?: number;
        filename?: string;
        hideGuides?: boolean;
    }
): Promise<string> => {
    const {
        pixelRatio = 3,
        filename = `design-export-${Date.now()}.png`,
        hideGuides = true,
    } = options || {};

    // 1. Collect all font families used in text elements
    const fontFamilies = elements
        .filter((el) => (el.type === 'text' || el.type === 'curvedText') && el.fontFamily)
        .map((el) => el.fontFamily!);

    // 2. Ensure all fonts are loaded
    const fontMap = buildFontMap();
    await ensureAllFontsLoaded(fontFamilies, fontMap);

    // 3. Hide guide elements (personalization area, transformer)
    const guidesToRestore: { node: Konva.Node; wasVisible: boolean }[] = [];

    if (hideGuides) {
        const personalizationRect = stage.findOne('#personalization-area');
        if (personalizationRect) {
            guidesToRestore.push({ node: personalizationRect, wasVisible: personalizationRect.visible() });
            personalizationRect.visible(false);
        }

        // Hide transformer
        const transformer = stage.findOne('Transformer');
        if (transformer) {
            guidesToRestore.push({ node: transformer, wasVisible: transformer.visible() });
            transformer.visible(false);
        }
    }

    // 4. Force a synchronous redraw
    stage.batchDraw();

    // Small delay to ensure the draw completes
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 5. Generate the data URL
    let dataUrl = '';
    try {
        dataUrl = stage.toDataURL({
            pixelRatio,
            mimeType: 'image/png',
            quality: 1,
        });
    } catch (err) {
        console.error('[ExportImage] Failed to export stage:', err);
    }

    // 6. Restore hidden guides
    guidesToRestore.forEach(({ node, wasVisible }) => {
        node.visible(wasVisible);
    });
    stage.batchDraw();

    // 7. Trigger download if we got a valid data URL
    if (dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return dataUrl;
};
