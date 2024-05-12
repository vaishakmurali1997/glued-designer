import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/liveCursors'
import { useMyPresence, useOthers } from '@/liveblocks.config'
import CursorChat from './cursor/cursorChat';
import { CursorMode } from '@/types/type';
const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  
  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden
  }); 

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({ cursor: { x, y } })
  }, [])

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({mode: CursorMode.Hidden})
    updateMyPresence({ cursor: null, message: null })
  }, [])

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({ cursor: { x, y } })
  }, [])

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === '/' ) {
        setCursorState({ 
          mode: CursorMode.Chat,
          previousMessage: null,
          message: ''
        })
      } else if (event.key === 'Escape') {
        updateMyPresence({ message: '' })
        setCursorState({ mode: CursorMode.Hidden})
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if(event.key === '/') {
        event.preventDefault()
      }
    }

    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('keydown', onKeyDown)
    }

  }, [updateMyPresence])

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className='h-[100vh] w-full flex justify-center items-center text-center
        border-2 border-color'
    >
      <h1 className="text-xl text-white"> Hello World - Glued Designer </h1>
      <LiveCursors others={others} />

      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
    </div>
  )
}

export default Live