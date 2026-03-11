import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '../store/editorStore';
import { TextElement } from './TextElement';
import { ImageElement } from './ImageElement';
import { TransformerBox } from './TransformerBox';
import { useHistoryStore } from '../store/historyStore';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';

export const CanvasStage: React.FC = () => {
    const { elements, deselectElement, setElements, template } = useEditorStore();
    const { undo, redo } = useHistoryStore();
    const stageRef = useRef<Konva.Stage>(null);

    const [baseImage] = useImage(template?.baseImage || '', 'anonymous');

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    // Redo: Ctrl+Shift+Z
                    const next = redo(elements);
                    if (next) setElements(next);
                } else {
                    // Undo: Ctrl+Z
                    const previous = undo(elements);
                    if (previous) setElements(previous);
                }
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [elements, undo, redo, setElements]);

    if (!template) return null;

    const handleStageClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        // Deselect logic: clear selection if empty stage or background image is clicked
        const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === 'base-image';
        if (clickedOnEmpty) {
            deselectElement();
        }
    };

    return (
        <div className="bg-white shadow-md rounded-sm overflow-hidden border border-slate-200">
            <Stage
                width={template.canvasWidth}
                height={template.canvasHeight}
                onMouseDown={handleStageClick}
                onTouchStart={handleStageClick}
                ref={stageRef}
                className="bg-white"
            >
                <Layer>
                    {baseImage && (
                        <KonvaImage
                            id="base-image"
                            image={baseImage}
                            width={template.canvasWidth}
                            height={template.canvasHeight}
                        />
                    )}

                    {/* Personalization Area */}
                    <Rect
                        x={template.personalizationArea.x}
                        y={template.personalizationArea.y}
                        width={template.personalizationArea.width}
                        height={template.personalizationArea.height}
                        stroke="blue"
                        strokeWidth={1}
                        dash={[4, 4]}
                        listening={false}
                    />

                    {elements.map((element) => {
                        if (element.type === 'text') {
                            return <TextElement key={element.id} element={element} />;
                        }
                        if (element.type === 'image') {
                            return <ImageElement key={element.id} element={element} />;
                        }
                        return null;
                    })}

                    <TransformerBox stageRef={stageRef} />
                </Layer>
            </Stage>
        </div>
    );
};
