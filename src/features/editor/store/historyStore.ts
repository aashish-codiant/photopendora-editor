import { create } from 'zustand';
import type { Element } from '../types/element';

interface HistoryState {
    past: Element[][];
    future: Element[][];
    pushState: (elements: Element[]) => void;
    undo: (currentElements: Element[]) => Element[] | null;
    redo: (currentElements: Element[]) => Element[] | null;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
    past: [],
    future: [],
    pushState: (elements) => {
        const { past } = get();
        // Deep copy to avoid reference issues
        const lastState = past[past.length - 1];
        if (JSON.stringify(lastState) === JSON.stringify(elements)) return;

        set({
            past: [...past, JSON.parse(JSON.stringify(elements))],
            future: []
        });
    },
    undo: (currentElements) => {
        const { past, future } = get();
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set({
            past: newPast,
            future: [JSON.parse(JSON.stringify(currentElements)), ...future]
        });

        return previous;
    },
    redo: (currentElements) => {
        const { past, future } = get();
        if (future.length === 0) return null;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
            past: [...past, JSON.parse(JSON.stringify(currentElements))],
            future: newFuture
        });

        return next;
    }
}));
