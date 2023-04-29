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

var savedY = 655;
var dY = -9;

const doodleImages = new Image();
doodleImages.src = "Sprite Sheet.png"

const doodleImagesTouched = new Image();
doodleImagesTouched.src = "Sprite Sheet2.png"

const spring1 = new Image();
spring1.src = "springs.png"

const doodleBackground = new Image();
doodleBackground.src = "background.png"

const menuBackground = new Image();
menuBackground.src = "Default.png"

const playButton = new Image();
playButton.src = "play.png"

const playButtonClicked = new Image();
playButtonClicked.src = "playClicked.png"

var playClicked = false;
export const setPlayClicked = () => {
  playClicked = true;
}

const gameOverBackground = new Image();
gameOverBackground.src = "gameOverBackground.png"

const playAgainButton = new Image();
playAgainButton.src = "playAgain.png"

/* const audioContext = new AudioContext();
const audioJump = new Audio('jump.mp3');
var source = audioContext.createMediaElementSource(audioJump);
source.connect(audioContext.destination);

const audioSprings = new Audio('springshoes.mp3');
source = audioContext.createMediaElementSource(audioJump);
source.connect(audioContext.destination);

const audioThrow = new Audio('basic_throw.mp3');
source = audioContext.createMediaElementSource(audioThrow);
source.connect(audioContext.destination);

const audioEndGame = new Audio('pada.mp3');
source = audioContext.createMediaElementSource(audioThrow);
source.connect(audioContext.destination);

const audioMonsters = new Audio('monsters.mp3');
source = audioContext.createMediaElementSource(audioThrow);
source.connect(audioContext.destination); */

// Permettant de jouer avec la graine de generation de map

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
  ctx: CanvasRenderingContext2D, id: number,
  { x, y }: { x: number; y: number }, hasSpring: boolean, touched: boolean | null
) => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 0, 480, 150, 45, x - 60, y - 20, 120, 40)
  if (hasSpring) {
    (touched !== null ?
      ctx.drawImage(spring1, 33, 0, 36, 40, x + (id % 2 == 0 ? 20 : -40), y - 44, 32, 38)
      : ctx.drawImage(spring1, 0, 0, 36, 20, x + (id % 2 == 0 ? 20 : -40), y - 30, 32, 22))
    ctx.fill()
    if (showCollisions) {
      ctx.beginPath()
      ctx.rect((x + (id % 2 == 0 ? 36 : -24)) - 16, (y - 19) - 11, 32, 22);
      ctx.strokeStyle = "magenta";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();
    }
  }
  if (showCollisions) {
    ctx.beginPath();
    ctx.rect(x - 45, y - 12, 95, 24);
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }
}

const drawDoodle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  rotated: boolean = false,
  touched: boolean = false
): void => {
  if (touched) {
    if (rotated) {
      ctx.beginPath()
      ctx.scale(-1, 1);
      ctx.drawImage(doodleImagesTouched, 390, 10, 200, 160, - (x + 48), y - 48, 96, 96)
      ctx.scale(-1, 1);
      ctx.fill();

    } else {
      ctx.beginPath()
      ctx.drawImage(doodleImagesTouched, 390, 10, 200, 160, (x - 48), y - 48, 96, 96)
      ctx.fill()
    }
  } else {
    if (rotated) {
      ctx.beginPath()
      ctx.scale(-1, 1);
      ctx.drawImage(doodleImages, 390, 10, 200, 160, - (x + 48), y - 48, 96, 96)
      ctx.scale(-1, 1);
      ctx.fill();

    } else {
      ctx.beginPath()
      ctx.drawImage(doodleImages, 390, 10, 200, 160, (x - 48), y - 48, 96, 96)
      ctx.fill()
    }
  }
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
  { x, y }: { x: number, y: number },
  rotated: boolean = false
): void => {
  if (rotated) {
    ctx.beginPath();
    ctx.scale(-1, 1);
    ctx.drawImage(doodleImages, 30, 310, 170, 150, -(x + 50), y - 50, 100, 100);
    ctx.scale(-1, 1);
    ctx.fill();
  } else {
    ctx.beginPath()
    ctx.drawImage(doodleImages, 30, 310, 170, 150, x - 50, y - 50, 100, 100)
    ctx.fill()
  }
  if (showCollisions) {
    ctx.beginPath()
    ctx.rect(x - 30, y - 40, 60, 80);
    ctx.strokeStyle = "violet";
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

const drawMonster2 = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number, y: number },
  rotated: boolean = false
): void => {
  if (rotated) {
    ctx.beginPath();
    ctx.scale(-1, 1);
    ctx.drawImage(doodleImages, 225, 165, 170, 100, -(x + 50), y - 50, 100, 75);
    ctx.scale(-1, 1);
    ctx.fill();
  } else {
    ctx.beginPath()
    ctx.drawImage(doodleImages, 225, 165, 170, 100, x - 50, y - 50, 100, 75)
    ctx.fill()
  }
  if (showCollisions) {
    ctx.beginPath()
    ctx.rect(x - 40, y - 25, 80, 45);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath()
    ctx.rect(x - 20, y - 37, 40, 10);
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

const drawBluePlatform = (
  ctx: CanvasRenderingContext2D, id: number,
  { x, y }: { x: number; y: number }, hasSpring: boolean, touched: boolean | null
): void => {
  ctx.beginPath()
  ctx.drawImage(doodleImages, 300, 480, 150, 45, x - 60, y - 20, 120, 40)
  if (hasSpring) {
    (touched !== null ?
      ctx.drawImage(spring1, 33, 0, 36, 40, x + (id % 2 == 0 ? 20 : -40), y - 44, 32, 38)
      : ctx.drawImage(spring1, 0, 0, 36, 20, x + (id % 2 == 0 ? 20 : -40), y - 30, 32, 22))
    if (showCollisions) {
      ctx.beginPath()
      ctx.rect((x + (id % 2 == 0 ? 36 : -24)) - 16, (y - 19) - 11, 32, 22);
      ctx.strokeStyle = "magenta";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();
    }
  }
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
  if (showCollisions) {
    ctx.beginPath()
    ctx.rect(x + 2, y - 10, 20, 20);
    ctx.strokeStyle = "orange ";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }
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

export const render_menu = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)
  const { height, width } = ctx.canvas
  ctx.beginPath()
  ctx.drawImage(menuBackground, 0, 0, width, height)
  ctx.fill()

  if (savedY > 655) {
    // audioJump.play();
    dY = -9;
  }

  savedY += dY;
  dY += 0.15;

  drawDoodle(ctx, { x: 90, y: savedY }, true)

  if (playClicked) {
    ctx.beginPath()
    ctx.drawImage(playButtonClicked, width - 250, height - 250)
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.drawImage(playButton, width - 250, height - 250)
    ctx.fill()
  }

  return true;
}

export const render_game_over = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)
  ctx.beginPath()
  ctx.drawImage(gameOverBackground, 0, 0, state.size.width, state.size.height)
  ctx.fill()

  ctx.font = "bold 60px Monospace"
  ctx.fillStyle = "black"
  ctx.fillText("" + state.scroll.id_touched, state.size.width / 2 - 25, state.size.height / 2 - 50)

  ctx.font = "bold 30px Monospace"
  if (state.scroll.id_touched <= 99) {
    ctx.fillText("(un peu nul quoi)", state.size.width / 2 - 150, state.size.height / 2 + 200)
  } else if (state.scroll.id_touched <= 300) {
    ctx.fillText("(pas mal)", state.size.width / 2 - 75, state.size.height / 2 + 200)
  } else if (state.scroll.id_touched > 300) {
    ctx.fillText("(gg)", state.size.width / 2 - 25, state.size.height / 2 + 200)
  }

  state.doodle.coord.y = state.doodle.coord.y + state.doodle.coord.dy
  drawDoodle(ctx, state.doodle.coord, true)
  draw_starts(ctx, { x: state.doodle.coord.x, y: state.doodle.coord.y })

  if (state.doodle.coord.y >= state.size.height / 2 + 50) {
    state.doodle.coord.dy = 0
  } else {
    // audioEndGame.play();
  }

  ctx.beginPath()
  ctx.drawImage(playAgainButton, state.size.width - 350, state.size.height - 200)
  ctx.fill()

}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  // Doodle outside 
  if (state.doodle.coord.y + 20 >= state.size.height) {
    state.doodle.life = 0;
    state.doodle.coord = { x: state.size.width / 2, y: 0, dx: 0, dy: 3 }
    state.view = "GameOver"
  }


  clear(ctx)
  drawBackground(ctx)

  state.platforms.forEach((plat, i) => {
    if (plat.coord.dx != 0) {
      drawBluePlatform(ctx, i, { x: plat.coord.x, y: plat.coord.y }, plat.hasSpring, plat.touched ?? null);
      if ((plat.coord.x + 60 > state.size.width) || (plat.coord.x - 60 < 0)) {
        plat.coord.dx = plat.coord.dx * (-1)
      }
      plat.coord.x = plat.coord.x + plat.coord.dx
    } else {
      drawGreenPlatform(ctx, i, { x: plat.coord.x, y: plat.coord.y }, plat.hasSpring, plat.touched ?? null)
    }
  }
  )

  state.ennemies.forEach(ennemi => {
    if (ennemi.dead) {
      draw_starts(ctx, { x: ennemi.x, y: ennemi.y })
    }
    if (ennemi.dx != 0) {
      // Monstre type 1
      if (ennemi.type == 1) {
        if ((ennemi.x + 50 > state.size.width) || (ennemi.x - 50 < 0)) {
          ennemi.dx = ennemi.dx * (-1)
        }
        if (ennemi.x % 20 == 0) {
          ennemi.dy = (-1) * ennemi.dy;
        }
        ennemi.x = ennemi.x + ennemi.dx;
        ennemi.y = ennemi.y + ennemi.dy;
        drawMonster1(ctx, { x: ennemi.x, y: ennemi.y }, (ennemi.dx > 0 ? false : true));
      } else if (ennemi.type == 2) {  // Monstre type 2
        if (ennemi.y % 10 == 0) {
          ennemi.dy = (-1) * ennemi.dy;
        }
        ennemi.y = ennemi.y + ennemi.dy;
        drawMonster2(ctx, { x: ennemi.x, y: ennemi.y }, (ennemi.dx > 0 ? false : true));
      }
    } else {
      if (ennemi.type == 1) {
        drawMonster1(ctx, { x: ennemi.x, y: ennemi.y }, (ennemi.dx > 0 ? false : true));
      } else if (ennemi.type == 2) {
        drawMonster2(ctx, { x: ennemi.x, y: ennemi.y }, (ennemi.dx > 0 ? false : true));
      }
    }

    if ((state.doodle.coord.y >= ennemi.y) && (ennemi.y >= 0)) {
      //audioMonsters.play();
    }
  }
  )


  // drawEvent(ctx, state.seed);
  if (state.scroll.id_touched >= state.platforms.length - 50) {
    let i = 0
    let lastY = state.platforms[state.platforms.length - 1].coord.y
    let minX = 50
    let maxX = state.size.width - 55
    let averageY = 50 + (Math.min(10 * state.seed, 80))
    while (i < 50) {
      state.platforms.push({
        hasSpring: Math.floor(Math.random() * 30) > 28 ? true : false,
        coord: {
          x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
          y: lastY - averageY,
          dx: (state.seed > 2) ? (state.seed > 3 ? (state.seed > 4 ? (i % 5 == 0 ? 1 : 0) : (i % 10 == 0 ? 1 : 0)) : (i % 20 == 0 ? 1 : 0)) : 0,
          dy: 0
        }
      })
      lastY = lastY - averageY
      if (state.seed > 5) {
        if ((state.seed > 9) && (i % 10 == 0)) {
          state.ennemies.push({
            x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
            y: lastY - averageY,
            dx: 1,
            dy: 0.5,
            type: Math.floor(Math.random() * (2 - 1 + 1)) + 1
          })
          lastY = lastY - averageY
        } else if (i % 20 == 0) {
          state.ennemies.push({
            x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
            y: lastY - averageY,
            dx: 1,
            dy: 0.5,
            type: Math.floor(Math.random() * (2 - 1 + 1)) + 1
          })
          lastY = lastY - averageY
        }
      }
      i++
    }
    state.seed++
  }




  state.balls.forEach(ball => drawBall(ctx, ball))
  if (state.doodle.shooting.is_shooting) {
    drawDoodleShooting(ctx, state.doodle.coord)
  } else if (state.doodle.direction == "LEFT") {
    if (state.doodle.touched == true) {
      drawDoodle(ctx, state.doodle.coord, false, true)
      if (state.doodle.audioTouched === 1) { // audioJump.play(); 
      }
    } else {
      drawDoodle(ctx, state.doodle.coord, false, false)
    }
  } else if (state.doodle.direction == "RIGHT") {
    if (state.doodle.touched == true) {
      drawDoodle(ctx, state.doodle.coord, true, true)
      if (state.doodle.audioTouched === 1) { // audioJump.play(); 
      }
    } else {
      drawDoodle(ctx, state.doodle.coord, true, false)
    }
  }


  /** Audios */
  if (state.doodle.audioTouched === 2) {
    // audioSprings.play();
  }
  if (state.doodle.audioTouched === 3) {
    // audioThrow.play();
    state.doodle.audioTouched = 0;
  }


  drawScore(ctx, state.scroll.id_touched)

  if (state.doodle.life === 0) {
    draw_starts(ctx, { x: state.doodle.coord.x, y: state.doodle.coord.y })
  }

  return true
}