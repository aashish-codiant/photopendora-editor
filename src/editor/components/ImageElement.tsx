import React, { useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import type { Element } from '../types/element';
import { useEditorStore } from '../store/editorStore';

interface ImageElementProps {
  element: Element;
}

export const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const imageRef = useRef<Konva.Image>(null);
  const updateElement = useEditorStore((state) => state.updateElement);
  const selectElement = useEditorStore((state) => state.selectElement);
  
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
      }}
    />
  );
};
