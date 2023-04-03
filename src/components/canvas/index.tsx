import * as conf from './conf'
import { useRef, useEffect } from 'react'
import { State, step, doodleMove, doodleStopMove } from './state'
import { render } from './renderer'

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    view: "Accueil",
    doodle: {
      life: conf.BALLLIFE,
      coord: {
        x: 400,
        y: height-40,
        dx: 0,
        dy: 14,
      },
      stopMoving : true,
      direction: null,
    },
    size: { height, width },
    platforms: new Array(6).fill(0).map((v,i) => {
      if (i > 0){
        return{
          x: ((i+1)%2 +1)*200 + Math.floor(Math.random() * (200 - 0 + 1)) + 0,
          y: height-i*220,
          dx: 0,
          dy: 0,
        };
      } else {
        return {
          x: ((i+1)%2 +1)*200,
          y: height-i*220,
          dx: 0,
          dy: 0,
        }
      }
    }
    )
  }

  const ref = useRef<any>()
  const state = useRef<State>(initialState)

  const iterate = (ctx: CanvasRenderingContext2D) => {
    state.current = step(state.current)
    render(ctx)(state.current)
    requestAnimationFrame(() => iterate(ctx))
  }

  const onMove = (e: KeyboardEvent) => {
    state.current = doodleMove(state.current, e)
  }
  const onStop = (e: KeyboardEvent) => {
    state.current = doodleStopMove(state.current, e)
  }
  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('keydown', onMove)
      ref.current.addEventListener('keyup', onStop)
    }
    return () => {
      ref.current.removeEventListener('click', onMove)
      ref.current.removeEventListener('mousemove', onMove)
    }
  }, [])
  return <canvas height={height} width={width} ref={ref} tabIndex={1} />
}

export default Canvas
