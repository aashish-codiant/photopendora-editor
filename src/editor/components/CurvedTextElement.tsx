import React, { useRef, useMemo } from 'react';
import { Group, Text } from 'react-konva';
import Konva from 'konva';
import type { Element } from '../types/element';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';

interface CurvedTextElementProps {
  element: Element;
}

export const CurvedTextElement: React.FC<CurvedTextElementProps> = React.memo(({ element }) => {
  const groupRef = useRef<Konva.Group>(null);
  const { elements, updateElement, selectElement, template } = useEditorStore();
  const pushState = useHistoryStore(state => state.pushState);

  // Default curve parameters
  const radius = element.radius || 120;
  const arcAngle = (element.arcAngle || 180) * (Math.PI / 180); // convert to radians
  const text = element.text || '';
  
  // Calculate character positions
  const chars = useMemo(() => {
    const chars = text.split('');
    if (chars.length === 0) return [];
    
    // Calculate angle step per character
    const angleStep = arcAngle / Math.max(1, chars.length - 1);
    
    // Start angle is centered around the top (-Math.PI / 2)
    const startAngle = -Math.PI / 2 - arcAngle / 2;

    return chars.map((char, i) => {
      // Angle for this character
      const angle = startAngle + i * angleStep;
      
      return {
        id: `char-${i}`,
        char,
        // Position on the circle
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        // Rotate text to follow the tangent
        rotation: (angle + Math.PI / 2) * (180 / Math.PI)
      };
    });
  }, [text, radius, arcAngle]);

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      draggable={!element.locked}
      dragBoundFunc={(pos) => {
        if (!template) return pos;
        const area = template.personalizationArea;
        // Simple bounding bounds (could be improved for circular objects)
        return {
          x: Math.max(area.x + radius, Math.min(pos.x, area.x + area.width - radius)),
          y: Math.max(area.y + radius, Math.min(pos.y, area.y + area.height - radius)),
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
        const node = groupRef.current;
        if (!node) return;
        
        // Convert scale to radius change to keep text rendering sharp
        const scaleX = node.scaleX();
        const newRadius = Math.max(20, radius * scaleX);
        
        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          radius: newRadius,
        });
        pushState(elements);
      }}
    >
      {chars.map((charData) => (
        <Text
          key={charData.id}
          text={charData.char}
          x={charData.x}
          y={charData.y}
          rotation={charData.rotation}
          fontSize={element.fontSize || 32}
          fontFamily={element.fontFamily || 'Arial'}
          fill={element.fill || '#000000'}
          fontStyle={element.fontStyle || 'normal'}
          offsetX={0}
          offsetY={0}
          align="center"
          verticalAlign="middle"
        />
      ))}
    </Group>
  );
});

CurvedTextElement.displayName = 'CurvedTextElement';
