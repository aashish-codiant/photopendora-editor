import React, { useRef } from 'react';
import { Group, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import type { Element } from '../types/element';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';

interface SvgElementProps {
  element: Element;
}

export const SvgElement: React.FC<SvgElementProps> = React.memo(({ element }) => {
  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);
  
  const { elements, updateElement, selectElement, template } = useEditorStore();
  const pushState = useHistoryStore(state => state.pushState);
  
  const [img] = useImage(element.svgUrl || '');

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      scaleX={element.scaleX || 1}
      scaleY={element.scaleY || 1}
      draggable={!element.locked}
      dragBoundFunc={(pos) => {
        if (!template) return pos;
        const area = template.personalizationArea;
        const node = groupRef.current;
        if (!node) return pos;

        const w = (element.width || 100) * node.scaleX();
        const h = (element.height || 100) * node.scaleY();

        return {
          x: Math.max(area.x, Math.min(pos.x, area.x + area.width - w)),
          y: Math.max(area.y, Math.min(pos.y, area.y + area.height - h)),
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
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
        pushState(elements);
      }}
    >
      <KonvaImage
        ref={imageRef}
        image={img}
        width={element.width || 100}
        height={element.height || 100}
      />
      {element.colorEditable && element.tintColor && (
        <Rect
          width={element.width || 100}
          height={element.height || 100}
          fill={element.tintColor}
          globalCompositeOperation="source-atop"
        />
      )}
    </Group>
  );
});

SvgElement.displayName = 'SvgElement';
