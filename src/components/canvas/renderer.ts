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

const drawDoodleShooting = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
) => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 200, 0, 160, 160, (x - 48) , y - 48, 96, 96) 
  ctx.fill()
}
const drawScore = (
  ctx: CanvasRenderingContext2D,
  score: number = 0,
  x: number = 10,
  y: number = 50,
  fontSize: number = 48
) => {
  ctx.font = "bold "+fontSize+"px Dejavu Sans"
  ctx.fillStyle = "black"
  ctx.fillText("Score: "+score, x, y)
}

const drawDoodleRotated = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
  ) => {
  ctx.beginPath()
  ctx.drawImage(doodleImagesRotated, 0, 0, 207, 160, (x - 48) , y - 48, 96, 96) 
  ctx.fill()
}

const drawBall = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
  ) => {
  ctx.beginPath()
  ctx.fillStyle = "black"
  ctx.arc(x+12, y, 10, 0, 2*Math.PI)
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
  if (state.doodle.coord.y >= state.size.height){
    clear(ctx)
    drawBackground(ctx)
    ctx.font = "bold 80px Dejavu Sans"
    ctx.fillStyle = "black"
    ctx.fillText("Game Over: ", state.size.width/2 - 275, state.size.height/2 - 100)
    drawScore(ctx, state.scroll.id_touched, state.size.width/2 - 175  , state.size.height/2, 75)

    ctx.font = "bold 35px Dejavu Sans"
    ctx.fillText("(un peu nul quoi)", state.size.width/2 - 175, state.size.height/2 + 700)

    return false
  }

  clear(ctx)
  drawBackground(ctx)
  
  
  state.platforms.forEach(plat => 
    drawGreenPlatform(ctx, {x: plat.x, y: plat.y})
    )
  
  if (state.scroll.id_touched >= state.platforms.length-20){
    let i = 25
    while(i + state.scroll.id_touched < state.scroll.id_touched + 55){
      let minX = 50
      let maxX = state.size.width-55
      let averageY = 80
      state.platforms.push({
        x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
        y: state.size.height-i*averageY, // 100  car on a deja la derniere platforme vers 200 
        dx: 0, 
        dy: 0
      })
      i++
    }
  }

  state.balls.forEach(ball => drawBall(ctx, ball))
  if(state.doodle.shooting.is_shooting){
    drawDoodleShooting(ctx, state.doodle.coord)
  } else if (state.doodle.direction == "LEFT"){
    drawDoodle(ctx, state.doodle.coord)
  } else if (state.doodle.direction == "RIGHT"){
    drawDoodleRotated(ctx, state.doodle.coord)
  } 

  drawScore(ctx, state.scroll.id_touched)

  return true 
}