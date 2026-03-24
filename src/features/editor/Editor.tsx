import { useState } from "react"
import { Button } from "@/components/ui/button"
import CanvasStage from "./components/CanvasStage"

export default function Editor() {
  const handleAddTextElement = () => {
    // Logic to add a new text element to the canvas
    // This could involve updating the state that holds the elements on the canvas
    
  }

  return (
    <div className="h-screen flex flex-col">

      <div className="p-4 border-b flex gap-2">

        <Button onClick={handleAddTextElement}>
          Add Text
        </Button>

      </div>

      <div className="flex-1 flex justify-center items-center bg-gray-100">
        <CanvasStage />
      </div>

    </div>
  )
}