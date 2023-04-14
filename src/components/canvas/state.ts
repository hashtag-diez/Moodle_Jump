import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Doodle = { shooting: Shooting, coord: Coord; life: number; peak?: number, stopMoving: boolean; direction: "LEFT" | "RIGHT" | null }
type Size = { height: number; width: number }
type Scroll = { id_touched: number, doScroll: boolean, savedDy: number }
type Shooting = {is_shooting: boolean, timeout?: NodeJS.Timeout | null, pressed: boolean}
export type State = {
  view: "Accueil" | "InGame" | "GameOver"
  doodle: Doodle
  size: Size
  platforms: Array<Coord>
  balls: Array<Coord>
  scroll: Scroll
  ennemies?: Array<Coord>
}

const dist2 = (o1: Coord, o2: Coord) => 
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)


const calculateDy = (y1: number, y2: number) => {
  const diff = Math.abs(y2 - y1)
  let dy = 0
  let sum = 0
  while (sum < diff) {
    sum = sum + dy
    dy = dy + 0.15
  }
  return -dy
}
const collide = (scroll: Scroll, o1: Coord, o2: Coord, i: number) =>
  (!scroll.doScroll || i == scroll.id_touched) && o1.dy > 0 && /* dist2(o1, o2) < Math.pow(68,2) */ o1.x+48 > o2.x-60 && o1.x-48 < o2.x+60 && o2.y > o1.y && (dist2(o1, o2) < Math.pow(68,2))

const iterateOnDoodle = (scroll: Scroll, doo: Doodle, touched: boolean, plat_touched: Coord | null, height: number) => {
  let { coord } = doo
  if (!touched) {
    coord.dy = (coord.dy + 0.15 > 10 ? 10 : (coord.dy > 0 ? coord.dy + 0.15 : coord.dy + 0.2))
  } else {
    coord.dy = calculateDy((plat_touched ? plat_touched.y : height - 100), height - 460)
    scroll.savedDy = coord.dy
  }
  coord.y = coord.y + coord.dy
  if (doo.stopMoving && coord.dx !== 0) {
    coord.dx = (coord.dx > 0 ? (coord.dx - 0.15 < 0 ? 0 : coord.dx - 0.15) : (coord.dx + 0.15 > 0 ? 0 : coord.dx + 0.15))
    coord.x = coord.x + coord.dx
  }
  else if(doo.stopMoving == false){
    coord.dx = (
      doo.direction == "LEFT" ? coord.dx - 0.12 :
        (doo.direction == "RIGHT" ? coord.dx + 0.12 :
          coord.dx
        )
    )
    coord.x = coord.x + coord.dx
  }
}

const iterateOnPlatforms = (scroll: Scroll, plats: Array<Coord>, height: number) => {
  let { id_touched, doScroll, savedDy } = scroll
  if (id_touched != -1 && plats[id_touched].y <= height - 100 && plats[id_touched].y + 7 >= height - 100) {
    // console.log("Tac")
    doScroll = false
  }
  plats.map(plat => {
    plat.dy = (doScroll && id_touched >= 0 ? 7 : 0)
    plat.y = plat.y + plat.dy
  })
  return { doScroll, id_touched, savedDy }
}

const iterateOnBalls = (scroll: Scroll, balls: Array<Coord>) =>{
  console.log(balls.length)
  balls.map(plat => {
    plat.y = plat.y + plat.dy
  })
  return balls.filter(ball => ball.y > 0)
}
const teleportation = (state: State) => {
  if (state.doodle.coord.x >= state.size.width) {
    state.doodle.coord.x = 0
  }
  else if (state.doodle.coord.x <= 0) {
    state.doodle.coord.x = state.size.width
  }
  return {
    ...state
  }
}

export const step = (state: State) => {
  teleportation(state)
  let touched = false
  state.platforms.map((plat, i) => {
    if (collide(state.scroll, state.doodle.coord, plat, i)) {
      touched = true
      state.scroll.id_touched = (state.platforms[i].y + 7 >= state.size.height - 60 ? state.scroll.id_touched : i)
    }
  })
  // FIXME pq && state.scroll.savedDy/2 > state.doodle.coord.dy) ? 
  if (state.scroll.id_touched != -1 && state.scroll.savedDy / 2 < state.doodle.coord.dy + 0.15) { // && state.scroll.savedDy/2 > state.doodle.coord.dy) {
    state.scroll.doScroll = true
  }
  state.balls = iterateOnBalls(state.scroll, state.balls)
  state.scroll = iterateOnPlatforms(state.scroll, state.platforms, state.size.height)
  iterateOnDoodle(state.scroll, state.doodle, touched, state.platforms[state.scroll.id_touched], state.size.height)
  return {
    ...state
  }
}

export const doodleMove =
  (state: State, event: KeyboardEvent): State => {
    const { code } = event
    if (code == "KeyD") {
      state.doodle.stopMoving = false
      console.log("KeyD")
      state.doodle.direction = "RIGHT";
    } else if (code == "KeyA") {
      state.doodle.stopMoving = false
      console.log("KeyQ")
      console.log("=> " + state.doodle.coord.dx)
      state.doodle.direction = "LEFT";
    }
    else {
      console.log("Autre")

      // state.doodle.direction = "RIGHT";
    }

    return { ...state }
  }
export const doodleStopMove = (state: State) => {
  state.doodle.stopMoving = true
  return {...state}
}
export const doodleShoot =
  (state: State): State => {

    if (!state.doodle.shooting.pressed) {
      state.doodle.shooting.pressed = true
      state.doodle.shooting.is_shooting = true
      const ball: Coord = {x: state.doodle.coord.x, y: state.doodle.coord.y-48, dx: 0, dy: -10}
      state.balls.push(ball)
      if(state.doodle.shooting.timeout){
        clearTimeout(state.doodle.shooting.timeout)
      }
      const timeout = setTimeout(() => {
        state.doodle.shooting.is_shooting = false
        if(state.doodle.shooting.timeout){
          clearTimeout(state.doodle.shooting.timeout)
        }
      }, 600)
      state.doodle.shooting.timeout = timeout
    }
    return { ...state }
  }
export const doodleStopShoot =
  (state: State): State => {
    state.doodle.shooting.pressed = false
    return { ...state }
}
export const endOfGame = (state: State): boolean => true
