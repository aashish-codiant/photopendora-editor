import React, { useRef } from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import type { Element } from '../types/element';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';

interface TextElementProps {
  element: Element;
}

export const TextElement: React.FC<TextElementProps> = React.memo(({ element }) => {
  const textRef = useRef<Konva.Text>(null);
  const { elements, updateElement, selectElement, template } = useEditorStore();
  const pushState = useHistoryStore(state => state.pushState);

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
      letterSpacing={element.letterSpacing || 0}
      lineHeight={element.lineHeight || 1}
      scaleX={1}
      scaleY={1}
      draggable={!element.locked}
      dragBoundFunc={(pos) => {
        if (!template) return pos;
        const area = template.personalizationArea;
        const node = textRef.current;
        if (!node) return pos;

        // Simplified Bounding box check for anchors
        return {
          x: Math.max(area.x, Math.min(pos.x, area.x + area.width - node.width() * node.scaleX())),
          y: Math.max(area.y, Math.min(pos.y, area.y + area.height - node.height() * node.scaleY())),
        };
      }}
      onClick={(e) => {
        if (element.locked) return;
        e.cancelBubble = true;
        selectElement(element.id);
      }}
      onTap={(e) => {
        if (element.locked) return;
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
        const node = textRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        
        // Convert scale into fontSize and reset scale
        node.scaleX(1);
        node.scaleY(1);

        let rot = node.rotation();
        rot = ((rot % 360) + 360) % 360;

        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          rotation: rot,
          // Use Math.max to prevent fontSize turning 0
          fontSize: Math.max(5, (element.fontSize || 40) * scaleX),
        });
        pushState(elements);
      }}
    />
  );
});

TextElement.displayName = 'TextElement';
