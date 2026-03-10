import useImage from "use-image"
import { useState, useRef, useEffect} from "react"
import { Stage, Layer, Image, Text, Transformer } from "react-konva"


export default function CanvasStage() {

  const [image] = useImage("/product.png")
  const transformerRef = useRef<any>(null)
  const stageRef = useRef<any>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [elements, setElements] = useState([
    {
      id: "text1",
      text: "Emma",
      x: 200,
      y: 200,
      fontsize: 40,
    }
  ])

  useEffect (()=>{

    if(!transformerRef.current) return

    const stage = stageRef.current
    const selectedNode = stage.findOne(`#${selectedId}`)

    if(selectedNode) {
      transformerRef.current.nodes([selectedNode])
      transformerRef.current.getLayer().batchDraw()
    }
  },[selectedId])

  return (
    <Stage
      width={800} 
      height={600}
      ref={stageRef}
      onMouseDown={(e) => {
      const clickedOnEmpty = e.target === e.target.getStage()
        if (clickedOnEmpty) {
          setSelectedId(null)
        }
      }}
    >
      <Layer>

      {elements.map((el) => (
        <Text
          key={el.id}
          id={el.id}
          text={el.text}
          x={el.x}
          y={el.y}
          fontSize={el.fontsize}
          draggable
          onClick={() => setSelectedId(el.id)}
          onTap={() => setSelectedId(el.id)}
        />
      ))}
      <Transformer
      ref={transformerRef}
      rotateEnabled={true}
      />

        {/* Product Base Image */}

        <Image
          image={image}
          width={800}
          height={600}
        />


      </Layer>
    </Stage>
  )
}