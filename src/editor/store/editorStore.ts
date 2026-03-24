import { create } from 'zustand';
import type { Element } from '../types/element';
import type { ProductTemplate } from '../types/template';
import { useHistoryStore } from './historyStore';

interface EditorState {
    elements: Element[];
    selectedElementId: string | null;
    template: ProductTemplate | null;
    designId: string | null;
    userUploads: string[];
    setTemplate: (template: ProductTemplate) => void;
    setDesignId: (id: string) => void;
    addTextElement: () => void;
    addCurvedTextElement: () => void;
    addImageElement: (url: string) => void;
    addSvgElement: (url: string, colorEditable?: boolean) => void;
    addUserUpload: (url: string) => void;
    updateElement: (id: string, attrs: Partial<Element>) => void;
    selectElement: (id: string | null) => void;
    deselectElement: () => void;
    deleteElement: (id: string) => void;
    bringForward: (id: string) => void;
    sendBackward: (id: string) => void;
    setElements: (elements: Element[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    elements: [],
    selectedElementId: null,
    template: null,
    designId: null,
    userUploads: [],
    setTemplate: (template) => set({ template }),
    setDesignId: (id) => set({ designId: id }),
    addTextElement: () => {
        const newId = `text_${Date.now()}`;
        const newElement: Element = {
            id: newId,
            type: "text",
            x: 400,
            y: 300,
            rotation: 0,
            text: "Your Text",
            fontSize: 40,
            fontFamily: "Arial",
            fill: "#000000",
            align: "center",
            fontStyle: "normal",
        };
        set((state) => {
            useHistoryStore.getState().pushState(state.elements);
            return {
                elements: [...state.elements, newElement],
                selectedElementId: newId
            };
        });
    },
    addCurvedTextElement: () => {
        const newId = `curvedText_${Date.now()}`;
        const newElement: Element = {
            id: newId,
            type: "curvedText",
            x: 400,
            y: 300,
            rotation: 0,
            text: "Curved Text",
            fontSize: 32,
            fontFamily: "Arial",
            fill: "#000000",
            fontStyle: "normal",
            radius: 120,
            arcAngle: 180,
        };
        set((state) => {
            useHistoryStore.getState().pushState(state.elements);
            return {
                elements: [...state.elements, newElement],
                selectedElementId: newId
            };
        });
    },
    addImageElement: (url) => {
        const newId = `image_${Date.now()}`;
        const newElement: Element = {
            id: newId,
            type: "image",
            x: 400,
            y: 300,
            width: 200,
            height: 200,
            rotation: 0,
            assetUrl: url,
        };
        set((state) => {
            useHistoryStore.getState().pushState(state.elements);
            return {
                elements: [...state.elements, newElement],
                selectedElementId: newId
            };
        });
    },
    addSvgElement: (url, colorEditable = false) => {
        const newId = `svg_${Date.now()}`;
        const newElement: Element = {
            id: newId,
            type: "svg",
            x: 400,
            y: 300,
            width: 150,
            height: 150,
            rotation: 0,
            svgUrl: url,
            colorEditable,
            tintColor: "#000000", // Default tint color
        };
        set((state) => {
            useHistoryStore.getState().pushState(state.elements);
            return {
                elements: [...state.elements, newElement],
                selectedElementId: newId
            };
        });
    },
    addUserUpload: (url) => set((state) => ({ userUploads: [url, ...state.userUploads] })),
    updateElement: (id, attrs) =>
        set((state) => ({
            elements: state.elements.map((el) =>
                el.id === id ? { ...el, ...attrs } : el
            ),
        })),
    selectElement: (id) => set({ selectedElementId: id }),
    deselectElement: () => set({ selectedElementId: null }),
    deleteElement: (id) => set((state) => {
        useHistoryStore.getState().pushState(state.elements);
        return {
            elements: state.elements.filter(el => el.id !== id),
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
        };
    }),
    bringForward: (id) => set((state) => {
        const index = state.elements.findIndex(el => el.id === id);
        if (index === state.elements.length - 1) return state;
        useHistoryStore.getState().pushState(state.elements);
        const newElements = [...state.elements];
        [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
        return { elements: newElements };
    }),
    sendBackward: (id) => set((state) => {
        const index = state.elements.findIndex(el => el.id === id);
        if (index === 0) return state;
        useHistoryStore.getState().pushState(state.elements);
        const newElements = [...state.elements];
        [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
        return { elements: newElements };
    }),
    setElements: (elements) => set({ elements }),
}));
