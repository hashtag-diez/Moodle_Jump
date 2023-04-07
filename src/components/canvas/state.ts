import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Doodle = { coord: Coord; life: number; pick?: number, stopMoving: boolean; direction: "LEFT" | "RIGHT" | null }
type Size = { height: number; width: number }

export type State = {
  view: "Accueil" | "InGame" | "GameOver"
  doodle: Doodle
  size: Size
  platforms: Array<Coord>
  id_touched: number
  ennemies?: Array<Coord>
}

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

const collide = (o1: Coord, o2: Coord) =>
  o1.dy>=0 && dist2(o1, o2) < Math.pow(68, 2)

const iterateOnDoodle = (doo: Doodle, touched: boolean) => {
  let { coord } = doo
  if (!touched) {
    coord.dy = (coord.dy + 0.15 > 10 ? 10 : (coord.dy > 0 ? coord.dy + 0.15 : coord.dy + 0.2))
  } else {
    console.log("Tic")
    coord.dy = -10
  }
  coord.y = coord.y + coord.dy
  if (doo.stopMoving && coord.dx !== 0) {
    coord.dx = (coord.dx > 0 ? (coord.dx - 0.15 < 0 ? 0 : coord.dx - 0.15): (coord.dx + 0.15 > 0 ? 0 : coord.dx + 0.15))
  } else {
    coord.dx = (
      doo.direction == "LEFT" ? coord.dx - 0.15 :
        (doo.direction == "RIGHT" ? coord.dx + 0.15 :
          coord.dx
        )
    )
  }
  coord.x = coord.x + coord.dx
}
const iterateOnPlatforms = (plats: Array<Coord>, touched : number, height: number ) => {
  if(touched>=0){
    touched = (plats[touched].y + 7 >= height - 100 ? -1 : touched)
  }
  plats.map(plat => {
    plat.dy = (touched>=0 ? 7 : 0)
    plat.y = plat.y + plat.dy
  })
}
export const step = (state: State) => {
  let touched = false
  state.platforms.map((plat,i) => {
    if (collide(state.doodle.coord, plat)) {
      touched = true
      state.id_touched = (state.platforms[i].y + 7 >= state.size.height - 100 ? -1 : i)
    }
  })
  iterateOnDoodle(state.doodle, touched)
  iterateOnPlatforms(state.platforms, state.id_touched, state.size.height)
  return {
    ...state
  }
}

export const doodleMove =
  (state: State, event: KeyboardEvent): State => {
    const { code } = event
    state.doodle.stopMoving = false
    state.doodle.direction = (code=="KeyD" ? "RIGHT" : "LEFT")
    return {...state}
  }
export const doodleStopMove =
  (state: State, event: KeyboardEvent): State => {
    const { code } = event
    if (code == "KeyA" || code == "KeyD") {
      console.log("TOC")
      state.doodle.stopMoving = true
      state.doodle.direction = null
    }
    return { ...state }
  }
export const endOfGame = (state: State): boolean => true
