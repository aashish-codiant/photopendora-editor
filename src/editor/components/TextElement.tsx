import React, { useRef } from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import type { Element } from '../types/element';
import { useEditorStore } from '../store/editorStore';

interface TextElementProps {
  element: Element;
}

export const TextElement: React.FC<TextElementProps> = ({ element }) => {
  const textRef = useRef<Konva.Text>(null);
  const updateElement = useEditorStore((state) => state.updateElement);
  const selectElement = useEditorStore((state) => state.selectElement);

  return (
    <Text
      ref={textRef}
      id={element.id}
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fill={element.fill}
      align={element.align}
      fontStyle={element.fontStyle}
      rotation={element.rotation}
      scaleX={1}
      scaleY={1}
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
        const node = textRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        
        // Convert scale into fontSize and reset scale
        node.scaleX(1);
        node.scaleY(1);

        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          // Use Math.max to prevent fontSize turning 0
          fontSize: Math.max(5, (element.fontSize || 40) * scaleX),
        });
      }}
    />
  );
};
