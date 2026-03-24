import type { Element } from '../types/element';

export const generateSVG = (elements: Element[], width: number = 800, height: number = 600, download: boolean = true): string => {
    let svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    elements.forEach((el) => {
        const rotation = el.rotation || 0;
        const x = el.x;
        const y = el.y;

        if (el.type === 'text') {
            const fontSize = el.fontSize || 40;
            const fontFamily = el.fontFamily || 'Arial';
            const fill = el.fill || '#000000';
            const text = el.text || '';
            const fontWeight = el.fontStyle?.includes('bold') ? 'bold' : 'normal';
            const fontStyle = el.fontStyle?.includes('italic') ? 'italic' : 'normal';

            svgContent += `
    <text 
        x="${x}" 
        y="${y}" 
        font-family="${fontFamily}" 
        font-size="${fontSize}" 
        fill="${fill}"
        font-weight="${fontWeight}"
        font-style="${fontStyle}"
        transform="rotate(${rotation}, ${x}, ${y})"
        dominant-baseline="middle"
        text-anchor="middle"
    >
        ${text}
    </text>`;
        } else if (el.type === 'image' && el.assetUrl) {
            const w = el.width || 100;
            const h = el.height || 100;
            
            svgContent += `
    <image 
        href="${el.assetUrl}" 
        x="${x - w/2}" 
        y="${y - h/2}" 
        width="${w}" 
        height="${h}" 
        transform="rotate(${rotation}, ${x}, ${y})"
    />`;
        }
    });

    svgContent += '\n</svg>';

    if (download) {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `production-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return svgContent;
};
