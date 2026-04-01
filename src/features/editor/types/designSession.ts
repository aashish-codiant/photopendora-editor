export interface DesignSession {
    designId: string;
    productId: string;
    designJSON: object;
    previewUrl: string;
    svgUrl: string;
    status: "draft" | "submitted";
    createdAt: Date;
}
