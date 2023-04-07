import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number }
type Doodle = { coord: Coord; life: number; stopMoving: boolean; direction: "LEFT" | "RIGHT" | null }
type Size = { height: number; width: number }

export type State = {
  view: "Accueil" | "InGame" | "GameOver"
  doodle: Doodle
  size: Size
  platforms: Array<Coord>
  ennemies?: Array<Coord>
}

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

const collide = (o1: Coord, o2: Coord) =>
  o1.dy>=0 && dist2(o1, o2) < Math.pow(68, 2)

const iterate = (doo: Doodle, touched: boolean) => {
  let { coord } = doo
  if (!touched) {
    coord.dy = (coord.dy + 0.15 > 14 ? 14 : (coord.dy > 0 ? coord.dy + 0.15 : coord.dy + 0.2))
  } else {
    coord.dy = -14
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
export const step = (state: State) => {
  let touched = false
  state.platforms.map(plat => {
    if (collide(state.doodle.coord, plat)) {
      touched = true
    }
  })
  iterate(state.doodle, touched)
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
