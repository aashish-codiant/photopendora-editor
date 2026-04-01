export interface Element {
    id: string;
    type: "text" | "image" | "curvedText" | "svg";
    x: number;
    y: number;
    rotation: number;
    locked?: boolean;
    scaleX?: number;
    scaleY?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    align?: "left" | "center" | "right";
    fontStyle?: "normal" | "bold" | "italic" | "italic bold";
    letterSpacing?: number;
    lineHeight?: number;
    assetUrl?: string;
    svgUrl?: string;
    width?: number;
    height?: number;
    radius?: number;     // For curvedText
    arcAngle?: number;   // For curvedText (in degrees)
    colorEditable?: boolean; // For SVG
    tintColor?: string;      // For SVG
}
