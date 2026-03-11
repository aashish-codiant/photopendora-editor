import React, { useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import type { Element } from '../types/element';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';

interface ImageElementProps {
  element: Element;
}

export const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const imageRef = useRef<Konva.Image>(null);
  const { elements, updateElement, selectElement, template } = useEditorStore();
  const pushState = useHistoryStore(state => state.pushState);
  
  const [img] = useImage(element.assetUrl || '');

  return (
    <KonvaImage
      ref={imageRef}
      id={element.id}
      x={element.x}
      y={element.y}
      scaleX={element.scaleX || 1}
      scaleY={element.scaleY || 1}
      image={img}
      rotation={element.rotation}
      draggable
      dragBoundFunc={(pos) => {
        if (!template) return pos;
        const area = template.personalizationArea;
        const node = imageRef.current;
        if (!node) return pos;

        return {
          x: Math.max(area.x, Math.min(pos.x, area.x + area.width - node.width() * node.scaleX())),
          y: Math.max(area.y, Math.min(pos.y, area.y + area.height - node.height() * node.scaleY())),
        };
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        selectElement(element.id);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        selectElement(element.id);
      }}
      onDragEnd={(e) => {
        updateElement(element.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
        pushState(elements);
      }}
      onTransformEnd={() => {
        const node = imageRef.current;
        if (!node) return;
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
        pushState(elements);
      }}
    />
  );
};
