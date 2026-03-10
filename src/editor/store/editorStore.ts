import { create } from 'zustand';
import type { Element } from '../types/element';

interface EditorState {
    elements: Element[];
    selectedElementId: string | null;
    addTextElement: () => void;
    updateElement: (id: string, attrs: Partial<Element>) => void;
    selectElement: (id: string | null) => void;
    deselectElement: () => void;
    deleteSelected: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    elements: [],
    selectedElementId: null,
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
        set((state) => ({
            elements: [...state.elements, newElement],
            selectedElementId: newId
        }));
    },
    updateElement: (id, attrs) =>
        set((state) => ({
            elements: state.elements.map((el) =>
                el.id === id ? { ...el, ...attrs } : el
            ),
        })),
    selectElement: (id) => set({ selectedElementId: id }),
    deselectElement: () => set({ selectedElementId: null }),
    deleteSelected: () => set((state) => ({
        elements: state.elements.filter(el => el.id !== state.selectedElementId),
        selectedElementId: null
    })),
}));
