import * as conf from './conf'
import { State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}
const doodleImages = new Image();
doodleImages.src = "Sprite Sheet.png"

const clear = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
}

const drawGreenPlatform = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
) => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 0, 480, 150, 45, x - 60, y - 20, 120, 40)
  ctx.fill()
}
const drawDoodle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
) => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 380, 0, 200, 160, x - 48, y - 48, 96, 96)
  ctx.fill()
}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)
  drawDoodle(ctx, state.doodle.coord)

  state.platforms.forEach(plat => 
    drawGreenPlatform(ctx, {x: plat.x, y: plat.y})
  )
}
