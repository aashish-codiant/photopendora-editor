import type { Element } from "./element";

export interface Design {
    id: string;
    designJSON: Element[];
    previewUrl: string;
    svgContent: string;
    status: string;
    createdAt: Date;
}