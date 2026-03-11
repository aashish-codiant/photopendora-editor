export interface Element {
    id: string;
    type: "text" | "image";
    x: number;
    y: number;
    rotation: number;
    scaleX?: number;
    scaleY?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    align?: "left" | "center" | "right";
    fontStyle?: "normal" | "bold" | "italic" | "italic bold";
    assetUrl?: string;
    width?: number;
    height?: number;
}
