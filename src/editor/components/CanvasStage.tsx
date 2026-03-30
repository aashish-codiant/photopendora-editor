import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '../store/editorStore';
import { TextElement } from './TextElement';
import { ImageElement } from './ImageElement';
import { CurvedTextElement } from './CurvedTextElement';
import { SvgElement } from './SvgElement';
import { TransformerBox } from './TransformerBox';
import { useHistoryStore } from '../store/historyStore';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';

export const CanvasStage: React.FC = () => {
    const { elements, deselectElement, setElements, template } = useEditorStore();
    const { undo, redo } = useHistoryStore();
    const stageRef = useRef<Konva.Stage>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);

    const [baseImage] = useImage(template?.baseImage || '', 'anonymous');

    // Handle Responsive Scaling
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current || !template) return;
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            
            // Calculate scale to fit canvas inside container padding
            const padding = 40;
            const availableW = containerWidth - padding;
            const availableH = containerHeight - padding;
            
            const scaleW = availableW / template.canvasWidth;
            const scaleH = availableH / template.canvasHeight;
            const newScale = Math.min(scaleW, scaleH, 1); // Never scale up beyond 1:1
            
            setScale(newScale);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call
        
        // Wait for fonts/images to potentially change layout
        const timer = setTimeout(handleResize, 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [template]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    const next = redo(elements);
                    if (next) setElements(next);
                } else {
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
        const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === 'base-image';
        if (clickedOnEmpty) {
            deselectElement();
        }
    };

    // Calculate background image placement to maintain aspect ratio (contain)
    const getBaseImageProps = () => {
        if (!baseImage) return null;
        
        const imgRatio = baseImage.width / baseImage.height;
        const canvasRatio = template.canvasWidth / template.canvasHeight;
        
        let width, height, x, y;
        
        if (imgRatio > canvasRatio) {
            width = template.canvasWidth;
            height = template.canvasWidth / imgRatio;
            x = 0;
            y = (template.canvasHeight - height) / 2;
        } else {
            height = template.canvasHeight;
            width = template.canvasHeight * imgRatio;
            x = (template.canvasWidth - width) / 2;
            y = 0;
        }
        
        return { x, y, width, height };
    };

    const imageProps = getBaseImageProps();

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center relative bg-slate-100/50">
            <div className="shadow-2xl rounded-lg overflow-hidden border border-slate-200 bg-white" style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out'
            }}>
                <Stage
                    width={template.canvasWidth}
                    height={template.canvasHeight}
                    onMouseDown={handleStageClick}
                    onTouchStart={handleStageClick}
                    ref={stageRef}
                    className="bg-white"
                >
                    <Layer>
                        {baseImage && imageProps && (
                            <KonvaImage
                                id="base-image"
                                image={baseImage}
                                {...imageProps}
                            />
                        )}

                    {/* Personalization Area */}
                    <Rect
                        id="personalization-area"
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
                        if (element.type === 'curvedText') {
                            return <CurvedTextElement key={element.id} element={element} />;
                        }
                        if (element.type === 'image') {
                            return <ImageElement key={element.id} element={element} />;
                        }
                        if (element.type === 'svg') {
                            return <SvgElement key={element.id} element={element} />;
                        }
                        return null;
                    })}

                    <TransformerBox stageRef={stageRef} />
                </Layer>
            </Stage>
        </div>
    </div>
);
};
