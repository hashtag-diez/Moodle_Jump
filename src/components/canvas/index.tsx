import * as conf from './conf'
import { useRef, useEffect } from 'react'
import { State, step, doodleMove, doodleStopMove, doodleShoot, doodleStopShoot, Plat } from './state'
import { render, setShowCollisions } from './renderer'

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
        y: height-400,
        dx: 0,
        dy: 7,
      },
      stopMoving : true,
      direction: "LEFT",
      shooting:{
        is_shooting: false,
        pressed: false
      }
    },
    scroll: {
      id_touched_ennemi: -1,
      id_touched: -1,
      doScroll: false,
      savedDy: 0,
    },
    size: { height, width },
    platforms: new Array(50).fill(0).map((v,i) => {
      if (i > 1) {
        let minX = 50
        let maxX = width-55
        let averageY = 50
        return {
          hasSpring: Math.floor(Math.random()*10)>8 ? true : false,
          coord: {
            x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
            y: height-(i+1)*averageY,
            dx: 0, // i%20==0 ? 1 : 0,
            dy: 0
          }
        }
      } else { 
        return {
          hasSpring: false,
          coord: {
            x: (1%2 +1)*200,
            y: height - 100,
            dx: 0,
            dy: 0
          }
        }
      } 
    }),
    balls: [],
    ennemies: []
  }

  const ref = useRef<any>()
  const state = useRef<State>(initialState)

  const iterate = (ctx: CanvasRenderingContext2D) => {
    state.current = step(state.current)
    if (render(ctx)(state.current) == false) return
    requestAnimationFrame(() => iterate(ctx))
  }

  const onMove = (e: KeyboardEvent) => {
    const { code } = e
  
    if (code == "KeyA" || code == "KeyD") {
      state.current = doodleMove(state.current, e)
    }
  }
  const onShoot = (e:KeyboardEvent) => {
    const { code } = e
  
    if (code == "Space") {
      state.current = doodleShoot(state.current)
    }
  }
  const onStopShoot = (e: KeyboardEvent) => {
    const { code } = e
    if (code == "Space") {
      state.current = doodleStopShoot(state.current)
    }
  }
  const onStop = (e: KeyboardEvent) => {
    const { code } = e
  
    if (code == "KeyA" || code == "KeyD") {
      state.current = doodleStopMove(state.current)
    }
  }
  const onCollisions = (e: KeyboardEvent) => {
    const { code } = e
  
    if (code == "KeyC") {
      setShowCollisions();
    }
  }
  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current)
      ref.current.addEventListener('keydown', onMove)
      ref.current.addEventListener('keydown', onShoot)
      ref.current.addEventListener('keyup', onStop)
      ref.current.addEventListener('keyup', onStopShoot)
      ref.current.addEventListener('keydown', onCollisions)
    }
    return () => {
      ref.current.removeEventListener('click', onMove)
      ref.current.removeEventListener('mousemove', onMove)
    }
  }, [])
  return <canvas height={height} width={width} ref={ref} tabIndex={1} />
}

export default Canvas
