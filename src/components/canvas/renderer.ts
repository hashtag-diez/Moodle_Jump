import * as conf from './conf'
import { State } from './state'

const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}

var showCollisions = false;
export const setShowCollisions = () => {
  showCollisions = !showCollisions;
}

const doodleImages = new Image();
doodleImages.src = "Sprite Sheet.png"

const doodleImagesRotated = new Image();
doodleImagesRotated.src = "Sprite Sheet rotate.png"

const doodleBackground = new Image();
doodleBackground.src = "background.png"

// Permettant de jouer avec la graine de generation de map
var mapVarGenerator = 1;

var stars: HTMLImageElement[] = [];
stars.push(new Image());
stars[0].src = "stars1.png";
stars.push(new Image());
stars[1].src = "stars2.png";
stars.push(new Image());
stars[2].src = "stars3.png";
var courant = 0;

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
  if (showCollisions) {
    ctx.rect(x - 45, y - 12, 95, 24);
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

const drawDoodle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
): void => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 390, 10, 200, 160, (x - 48), y - 48, 96, 96)
  ctx.fill()
  if (showCollisions) {
    ctx.beginPath()
    ctx.moveTo(x - 25, y + 40);
    ctx.lineTo(x + 20, y + 40);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath()
    ctx.moveTo(x - 25, y - 40);
    ctx.lineTo(x + 20, y - 40);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
  }
}

const drawDoodleShooting = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
) => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 200, 0, 160, 160, (x - 48), y - 48, 96, 96)
  ctx.fill()
}
const drawMonster1 = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number, y: number }
): void => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 30, 310, 170, 150, x - 50, y - 50, 100, 100)
  ctx.fill()
  if (showCollisions) {
    ctx.beginPath()
    ctx.rect(x - 30, y - 40, 60, 80);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath()
    ctx.rect(x - 20, y - 50, 40, 10);
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }
}


const drawScore = (
  ctx: CanvasRenderingContext2D,
  score: number = 0,
  x: number = 10,
  y: number = 50,
  fontSize: number = 48
) => {
  ctx.font = "bold " + fontSize + "px Dejavu Sans"
  ctx.fillStyle = "black"
  ctx.fillText("Score: " + score, x, y)
}

const drawEvent = (
  ctx: CanvasRenderingContext2D,
  val: number = 0,
  x: number = 300,
  y: number = 25,
  fontSize: number = 16
) => {
  ctx.font = "bold " + fontSize + "px Dejavu Sans"
  ctx.fillStyle = "black"
  ctx.fillText("[TEST] Diffcult evel: " + val, x, y)
}

const drawDoodleRotated = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
) => {
  ctx.beginPath()
  ctx.drawImage(doodleImagesRotated, 20, 10, 200, 160, (x - 48), (y - 48), 96, 96)
  ctx.fill()
  if (showCollisions) {
    ctx.beginPath()
    ctx.moveTo(x - 25, y + 40);
    ctx.lineTo(x + 20, y + 40);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath()
    ctx.moveTo(x - 25, y - 40);
    ctx.lineTo(x + 20, y - 40);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
  }
}

const drawBluePlatform = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
): void => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 300, 480, 150, 45, x - 60, y - 20, 120, 40)
  ctx.fill()
  if (showCollisions) {
    ctx.rect(x - 45, y - 12, 95, 24);
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function draw_starts(
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number, y: number }
) {
  let indice
  if (courant < 25) {
    indice = 0;
  } else if (courant < 50) {
    indice = 1;
  } else if (courant < 75) {
    indice = 2;
  } else {
    courant = 0;
    indice = 0;
  }

  ctx.drawImage(stars[indice], x - 20, y - 70)

  courant++;
}

const drawBall = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
) => {
  ctx.beginPath()
  ctx.fillStyle = "black"
  ctx.arc(x + 12, y, 10, 0, 2 * Math.PI)
  ctx.fill()
}

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  color: string,
  rayon: number
) => {
  ctx.beginPath()
  ctx.arc(x, y, rayon, 0, 2 * Math.PI)
  ctx.strokeStyle = color
  ctx.lineWidth = 3;
  ctx.stroke();
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
  if (state.doodle.coord.y + 20 >= state.size.height) {
    clear(ctx)
    drawBackground(ctx)
    ctx.font = "bold 60px Dejavu Sans"
    ctx.fillStyle = "black"
    ctx.fillText("Game Over: ", state.size.width / 2 - 200, state.size.height / 2 - 100)
    drawScore(ctx, state.scroll.id_touched, state.size.width / 2 - 125, state.size.height / 2 - 50, 50)

    ctx.font = "bold 30px Dejavu Sans"
    ctx.fillText("(un peu nul quoi)", state.size.width / 2 - 150, state.size.height / 2 + 200)

    return false
  }


  clear(ctx)
  drawBackground(ctx)

  state.platforms.forEach(plat => {
    if (plat.dx != 0) {
      drawBluePlatform(ctx, { x: plat.x, y: plat.y });
      if ((plat.x + 60 > state.size.width) || (plat.x - 60 < 0)) {
        plat.dx = plat.dx * (-1)
      }
      plat.x = plat.x + plat.dx
    } else {
      drawGreenPlatform(ctx, { x: plat.x, y: plat.y })
    }
  }
  )

  state.ennemies.forEach(ennemi => {
    if (ennemi.dx != 0) {
      drawMonster1(ctx, { x: ennemi.x, y: ennemi.y });
      if ((ennemi.x + 50 > state.size.width) || (ennemi.x - 50 < 0)) {
        ennemi.dx = ennemi.dx * (-1)
      }
      ennemi.x = ennemi.x + ennemi.dx
    } else {
      alert("sans dx")
      drawMonster1(ctx, { x: ennemi.x, y: ennemi.y });
    }
    if (ennemi.dy == -100) {
      draw_starts(ctx, { x: ennemi.x, y: ennemi.y })
    }
  }
  )


  drawEvent(ctx, mapVarGenerator - 1);
  if (state.scroll.id_touched >= state.platforms.length - 30) {
    let i = 0
    while (i < 30) {
      let minX = 50
      let maxX = state.size.width - 55
      let averageY = 50 + (Math.min(10 * mapVarGenerator, 100))
      state.platforms.push({
        x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
        y: state.size.height - (i + 29) * averageY - mapVarGenerator, // a revoir tout ca  
        dx: (mapVarGenerator > 3) ? (mapVarGenerator > 4 ? (mapVarGenerator > 5 ? (i % 2 == 0 ? 1 : 0) : (i % 10 == 0 ? 1 : 0)) : (i % 20 == 0 ? 1 : 0)) : 0,
        dy: 0
      })
      if ((mapVarGenerator > 3) && ((i + 10) % 20 == 0)) {
        state.ennemies.push({
          x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
          y: state.size.height - (i + 7) * averageY,
          dx: 1,
          dy: 0
        })
      }
      i++
    }
    mapVarGenerator++;
  }


  state.balls.forEach(ball => drawBall(ctx, ball))
  if (state.doodle.shooting.is_shooting) {
    drawDoodleShooting(ctx, state.doodle.coord)
  } else if (state.doodle.direction == "LEFT") {
    drawDoodle(ctx, state.doodle.coord)
  } else if (state.doodle.direction == "RIGHT") {
    drawDoodleRotated(ctx, state.doodle.coord)
  }

  drawScore(ctx, state.scroll.id_touched)



  if (state.doodle.life === 0) {
    draw_starts(ctx, { x: state.doodle.coord.x, y: state.doodle.coord.y })
  }

  return true
}