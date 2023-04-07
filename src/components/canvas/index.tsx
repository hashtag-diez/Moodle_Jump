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
        y: height-200,
        dx: 0,
        dy: 7,
      },
      stopMoving : true,
      direction: "LEFT",
    },
    scroll: {
      id_touched: -1,
      doScroll: false,
      savedDy: 7
    },
    size: { height, width },
    platforms: new Array(50).fill(0).map((v,i) => {
      if (i > 1) {
        let minX = 50
        let maxX = width-55
        let averageY = 80
        return{
          x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
          y: height-i*averageY, 
          dx: 0,
          dy: 0,
        };
      } else {  // la premiere platforme
        return {
          x: (1%2 +1)*200,
          y: height-200,
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
    if (render(ctx)(state.current) == false) return
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
