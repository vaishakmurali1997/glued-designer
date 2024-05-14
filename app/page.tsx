"use client";

import {fabric} from "fabric";

import LeftSideBar from "@/components/leftSideBar/leftSideBar";
import Live from "@/components/live";
import Navbar from "@/components/navbar";
import RightSideBar from "@/components/rightSideBar/rightSideBar";
import { useEffect, useRef, useState } from "react";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";
import { ActiveElement } from "@/types/type";

export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const fabricRef = useRef<fabric.Canvas| null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null> (null); 
  const selectedShapeRef = useRef<string | null> ('rectangle');
  
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: ''
  }); 
  
  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    selectedShapeRef.current = elem?.value as string;

  }
  
  useEffect(() => {
    const canvas = initializeFabric({canvasRef, fabricRef});
    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef
      })
    })

    window.addEventListener("resize", () => {
      handleResize({fabricRef}); 
    })
  }, [])
  
  return (
    <main className="h-screen overflow-hidden">
      <Navbar activeElement={activeElement} handleActiveElement={handleActiveElement}/>
      <section className="flex h-full flex-row">
        <LeftSideBar />
        <Live canvasRef={canvasRef} />
        <RightSideBar />
      </section>
    </main>
  );
}