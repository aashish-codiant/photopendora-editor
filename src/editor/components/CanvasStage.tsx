import React, { useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '../store/editorStore';
import { TextElement } from './TextElement';
import { ImageElement } from './ImageElement';
import { TransformerBox } from './TransformerBox';
import { useHistoryStore } from '../store/historyStore';
import { useEffect } from 'react';

import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';

const BASE_IMAGE_URL = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800&h=600';

export const CanvasStage: React.FC = () => {
  const { elements, deselectElement, setElements } = useEditorStore();
  const { undo, redo } = useHistoryStore();
  const stageRef = useRef<Konva.Stage>(null);
  
  const [baseImage] = useImage(BASE_IMAGE_URL, 'anonymous');

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
        width={800}
        height={600}
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
              width={800}
              height={600}
            />
          )}

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
