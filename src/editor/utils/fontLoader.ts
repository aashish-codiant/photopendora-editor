/**
 * Font Loader Utility
 * Uses CSS Font Loading API (document.fonts) to ensure fonts are fully loaded
 * before rendering in Konva or exporting images.
 */

// Track which fonts have been loaded to avoid redundant load calls
const loadedFonts = new Set<string>();

/**
 * Inject a Google Fonts <link> tag into <head> if not already present.
 */
export const injectGoogleFontLink = (url: string): void => {
    if (!url) return;
    // Check if already injected
    const existing = document.querySelector(`link[href="${url}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
};

/**
 * Load a specific font family using the CSS Font Loading API.
 * Resolves once the font is ready to render, or after a timeout.
 */
export const loadFont = async (fontFamily: string, fontUrl?: string): Promise<void> => {
    // Skip system fonts
    if (fontFamily === 'Arial' || fontFamily === 'Helvetica' || fontFamily === 'Times New Roman') {
        return;
    }

    // Already loaded in this session
    if (loadedFonts.has(fontFamily)) {
        return;
    }

    // Inject the Google Font CSS link if provided
    if (fontUrl) {
        injectGoogleFontLink(fontUrl);
    }

    try {
        // Use CSS Font Loading API
        if (document.fonts) {
            // Try loading at 40px (a reasonable test size)
            await document.fonts.load(`16px "${fontFamily}"`);

            // Wait for all fonts to be ready
            await document.fonts.ready;

            loadedFonts.add(fontFamily);
        }
    } catch (err) {
        console.warn(`[FontLoader] Failed to load font "${fontFamily}":`, err);
        // Don't block — the font may still work from cache or system
    }
};

/**
 * Ensure all fonts used by the current elements are loaded.
 * Call this before exporting to PNG/SVG.
 */
export const ensureAllFontsLoaded = async (
    fontFamilies: string[],
    fontMap?: Map<string, string> // fontFamily -> googleFontUrl
): Promise<void> => {
    const uniqueFonts = [...new Set(fontFamilies)];

    const promises = uniqueFonts.map((family) => {
        const url = fontMap?.get(family);
        return loadFont(family, url);
    });

    await Promise.all(promises);

    // Extra safety: wait for document.fonts.ready
    if (document.fonts) {
        await document.fonts.ready;
    }
};
