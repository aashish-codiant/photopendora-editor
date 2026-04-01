import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
import Konva from 'konva';
import { useEditorStore } from '../store/editorStore';

interface TransformerBoxProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export const TransformerBox: React.FC<TransformerBoxProps> = ({ stageRef }) => {
  const trRef = useRef<Konva.Transformer>(null);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);

  useEffect(() => {
    if (trRef.current && stageRef.current) {
      if (selectedElementId) {
        const selectedNode = stageRef.current.findOne(`#${selectedElementId}`);
        if (selectedNode) {
          // Check if element is locked
          const element = useEditorStore.getState().elements.find(el => el.id === selectedElementId);
          if (element?.locked) {
            trRef.current.nodes([]);
          } else {
            trRef.current.nodes([selectedNode]);
          }
          trRef.current.getLayer()?.batchDraw();
        }
      } else {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedElementId, stageRef]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
    />
  );
};
