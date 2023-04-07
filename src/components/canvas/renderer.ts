import * as conf from './conf'
import { State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}

const doodleImages = new Image();
doodleImages.src = "Sprite Sheet.png"

const doodleImagesRotated = new Image();
doodleImagesRotated.src = "Sprite Sheet rotate.png"

const doodleBackground = new Image();
doodleBackground.src = "background.png" 

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
  ctx.drawImage(doodleImages, 380, 0, 200, 160, (x - 48) , y - 48, 96, 96) 
  ctx.fill()
}

const drawDoodleRotated = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
  ) => {
  ctx.beginPath()
  ctx.drawImage(doodleImagesRotated, 0, 0, 210, 160, (x - 48) , y - 48, 96, 96) 
  ctx.fill()
}

const drawBackground = (
  ctx: CanvasRenderingContext2D
) => {
  const { height, width } = ctx.canvas
  ctx.beginPath()
  ctx.drawImage(doodleBackground, 0, 0, width, height)
  ctx.fill()
}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)
  drawBackground(ctx)
  if (state.doodle.direction == "LEFT"){
    drawDoodle(ctx, state.doodle.coord)
  } else if (state.doodle.direction == "RIGHT"){
    drawDoodleRotated(ctx, state.doodle.coord)
  } 
  

  state.platforms.forEach(plat => 
    drawGreenPlatform(ctx, {x: plat.x, y: plat.y})
  )

  console.log("Id touched: "+state.id_touched)

  if (state.id_touched >= state.platforms.length-1){
    let i = 0
    while(i < 50){
      state.platforms.push({x: ((state.platforms.length+i)%2 +1)*200 + Math.floor(Math.random() * (200 - 0 + 1)) + 0, y: state.size.height-(state.platforms.length+i)*220, dx: 0, dy: 0})
      i++
    }
  }

}