import * as conf from './conf'
type Coord = { x: number; y: number; dx: number; dy: number, dead?: boolean, type?: number }
type Plat = { hasSpring: boolean, touched?: boolean, coord: Coord }
type Doodle = { flying: boolean, shooting: Shooting, coord: Coord; life: number, stopMoving: boolean; direction: "LEFT" | "RIGHT" | null, touched?: boolean, audioTouched?: number }
type Size = { height: number; width: number }
type Scroll = { id_touched_ennemi: number, id_touched: number, doScroll: boolean, savedDy: number }
type Shooting = { is_shooting: boolean, timeout?: NodeJS.Timeout | null, pressed: boolean }

export type State = {
  view: "Accueil" | "InGame" | "GameOver"
  doodle: Doodle
  size: Size
  platforms: Array<Plat>
  balls: Array<Coord>
  scroll: Scroll
  ennemies: Array<Coord>
  seed: number
}

export type { Plat }

const collide_spring = (doo: Doodle, plat: Plat, id: number) => {
  if (!plat.hasSpring) return false
  const o2 = { x: plat.coord.x + (id % 2 == 0 ? 36 : -24), y: plat.coord.y - 19 }
  return (doo.coord.dy > 0 && (((doo.coord.x - 25 < o2.x - 16) && doo.coord.x + 20 > o2.x - 16) || ((doo.coord.x - 25 < o2.x + 16) && doo.coord.x + 20 > o2.x + 16)) && (((doo.coord.y + 40) < o2.y + 11) && ((doo.coord.y + 40) > o2.y - 11)))
}

const collide_platforms = (o1: Coord, o2: Coord) => {
  return (o1.dy > 0 && (((o1.x - 25) < o2.x + 50) && ((o1.x + 20) > o2.x - 45)) && (((o1.y + 40) < o2.y + 12) && ((o1.y + 40) > o2.y - 12)))
}

const collid_ennemis = (scroll: Scroll, o1: Coord, o2: Coord, i: number, state: State) => {
  // Monstre type 1 
  if (o2.type == 1) {
    if (/* !state.doodle.flying && */ ((((o1.x - 25) < o2.x + 30) && ((o1.x + 20) > o2.x - 30)) && (((o1.y - 40) < o2.y + 40) && ((o1.y - 40) > o2.y - 40)))) {
      state.doodle.life = 0;
      return false;
    } else if ((!scroll.doScroll || i == scroll.id_touched_ennemi) && o1.dy > 0 && (((o1.x - 25) < o2.x + 20) && ((o1.x + 20) > o2.x - 20)) && (((o1.y + 40) < o2.y - 40) && ((o1.y + 40) > o2.y - 50))) {
      return true;
    }
  } else if (o2.type == 2) {  // Monstre type 2
    if ((((o1.x - 25) < o2.x + 40) && ((o1.x + 20) > o2.x - 40)) && (((o1.y - 40) < o2.y + 20) && ((o1.y - 40) > o2.y - 25))) {
      state.doodle.life = 0;
      return false;
    } else if ((!scroll.doScroll || i == scroll.id_touched_ennemi) && o1.dy > 0 && (((o1.x - 25) < o2.x + 20) && ((o1.x + 20) > o2.x - 20)) && (((o1.y + 40) < o2.y - 27) && ((o1.y + 40) > o2.y - 37))) {
      return true;
    }
  }
  return false;
}


const iterateOnDoodle = (scroll: Scroll, doo: Doodle, touched: boolean) => {
  let { flying, coord } = doo
  if (!touched) {
    if (!scroll.doScroll && scroll.savedDy > 0) {
      coord.dy = -9 + scroll.savedDy;
      scroll.savedDy = 0;
    }

    // pour arreter l'animation
    if (coord.dy >= 0) {
      doo.touched = false
    }
    if (doo.audioTouched != 3) {
      doo.audioTouched = 0 // 0 for no sound
    }

    coord.dy = coord.dy + 0.2
    coord.dy = (flying && coord.dy > 0 ? 0 : coord.dy)
    // coord.dy = (coord.dy + 0.15 > 10 ? 10 : (coord.dy > 0 ? coord.dy + 0.15 : coord.dy + 0.2))
  } else {
    // coord.dy = calculateDy((plat_touched ? plat_touched.y : height - 100), height - 460)
    if (doo.life !== 0) {
      if (coord.dy > 0) {
        coord.dy = -9
      }
      doo.touched = true // pour demarrer l'animation
    }
  }
  coord.y = coord.y + coord.dy
  if (doo.stopMoving && coord.dx !== 0) {
    coord.dx = (coord.dx > 0 ? (coord.dx - 0.15 < 0 ? 0 : coord.dx - 0.15) : (coord.dx + 0.15 > 0 ? 0 : coord.dx + 0.15))
    coord.x = coord.x + coord.dx
  }
  else if (doo.stopMoving == false) {
    coord.dx = (
      doo.direction == "LEFT" ? Math.max(coord.dx - 0.15, -6) :
        (doo.direction == "RIGHT" ? Math.min(coord.dx + 0.15, 6) :
          coord.dx
        )
    )
    coord.x = coord.x + coord.dx
  }
}

const iterateOnPlatforms = (scroll: Scroll, plats: Array<Plat>, height: number, ennemis: Array<Coord>, state: State) => {
  let { id_touched_ennemi, id_touched, doScroll, savedDy } = scroll
  let dyScroll = 0
  if (!state.doodle.flying && id_touched != -1 && (id_touched_ennemi == -1 || plats[id_touched].coord.y < ennemis[id_touched_ennemi].y) && plats[id_touched].coord.y <= height - 100 && plats[id_touched].coord.y + 7 >= height - 100) {
    doScroll = false
    dyScroll = 0;
  }
  if (state.doodle.flying && plats[id_touched].coord.y > state.size.height * 2) {
    doScroll = false
    dyScroll = 0;
    state.doodle.flying = false
  }
  if (doScroll && (id_touched || id_touched_ennemi)) {
    dyScroll = (state.doodle.flying ? 10 : 7);
    (plats[id_touched].hasSpring && plats[id_touched].touched == true ? state.doodle.flying = true : "")
  }

  if (dyScroll > 0 && !state.doodle.flying) {
    state.doodle.coord.dy = -0.2;
    savedDy += 0.2;
  }

  plats.map(plat => {
    plat.coord.y = plat.coord.y + dyScroll;
  })

  ennemis.map(ennemi => {
    ennemi.y = ennemi.y + dyScroll;
  })
  return { id_touched_ennemi, doScroll, id_touched, savedDy }
}

const iterateOnEnnemis = (scroll: Scroll, ennemis: Array<Coord>, height: number, balls: Array<Coord>): [Array<Coord>, Coord[], Scroll] => {
  let { id_touched_ennemi, id_touched, doScroll, savedDy } = scroll
  if (id_touched_ennemi != -1 && ennemis[id_touched_ennemi].y >= height + 100) {
    id_touched_ennemi = -1;
  }
  ennemis.map(ennemi => {
    let dy = ((id_touched_ennemi >= 0) ? 3 : 0)
    ennemi.y = ennemi.y + dy
  })
  const newBalls = balls
  const newEnnemis = ennemis.filter((ennemi,i) => {
    let nottouched = true
    balls.forEach((ball, i) => {
      if (ennemi.type == 1) {
        if (((ball.x < ennemi.x + 30) && ((ball.x +10) > ennemi.x - 30)) && (((ball.y) < ennemi.y + 40) && ((ball.y + 10) > ennemi.y - 40))) {
          nottouched =  false;
          newBalls.splice(i, 1)
        }
      } else if (ennemi.type == 2) {  // Monstre type 2
        if (((ball.x < ennemi.x + 40) && ((ball.x + 10) > ennemi.x - 40)) && ((ball.y < ennemi.y + 22) && (ball.y > ennemi.y - 22))) {
          nottouched =  false;
          newBalls.splice(i, 1)
        }
      }
    })
    return nottouched
  })
  return [newBalls, newEnnemis, { id_touched_ennemi, doScroll, id_touched, savedDy }]
}

const iterateOnBalls = (balls: Array<Coord>) => {
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
  state.ennemies.map((ennemi, i) => {
    if (collid_ennemis(state.scroll, state.doodle.coord, ennemi, i, state)) {
      touched = true;
      state.scroll.id_touched_ennemi = i;
      state.ennemies[i].dead = true; // psq il meurt, permet d'afficher les stars dans le renderer
    } else {
      if (state.doodle.life === 0) {
        state.doodle.coord.dy = 1
      }
    }
  })
  if (state.doodle.life !== 0) {
    state.platforms.map((plat, i) => {
      if (collide_spring(state.doodle, plat, i)) {
        touched = true
        state.doodle.flying = true
        plat.touched = true
        state.scroll.id_touched = i
        state.scroll.doScroll = true
        state.doodle.audioTouched = 2 // 2 for springs sound
      } else if (collide_platforms(state.doodle.coord, plat.coord)) {
        touched = true
        if (i != state.scroll.id_touched) {
          state.doodle.audioTouched = 1 // 1 for jump sound
        }
        state.scroll.id_touched = (state.platforms[i].coord.y + 7 >= state.size.height - 60 ? state.scroll.id_touched : i)
        state.scroll.doScroll = true
      }
    })
  }

  // FIXME pq && state.scroll.savedDy/2 > state.doodle.coord.dy) ? 
  // if (state.scroll.id_touched != -1 && state.scroll.savedDy / 2 < state.doodle.coord.dy + 0.15) { // && state.scroll.savedDy/2 > state.doodle.coord.dy) {
  // }

  state.balls = iterateOnBalls(state.balls)
  state.scroll = iterateOnPlatforms(state.scroll, state.platforms, state.size.height, state.ennemies, state)
  let [balls, enn, scroll] = iterateOnEnnemis(state.scroll, state.ennemies, state.size.height, state.balls)
  state.scroll = scroll
  state.ennemies = enn
  state.balls = balls
  iterateOnDoodle(state.scroll, state.doodle, touched)
  return {
    ...state
  }
}

export const doodleMove =
  (state: State, event: KeyboardEvent): State => {
    const { code } = event
    if (code == "KeyD") {
      state.doodle.stopMoving = false
      state.doodle.direction = "RIGHT";
    } else if (code == "KeyA") {
      state.doodle.stopMoving = false
      state.doodle.direction = "LEFT";
    }


    return { ...state }
  }
export const doodleStopMove = (state: State) => {
  state.doodle.stopMoving = true
  return { ...state }
}

export const doodleShoot =
  (state: State): State => {
    if (!state.doodle.shooting.pressed) {
      state.doodle.shooting.pressed = true
      state.doodle.shooting.is_shooting = true
      const ball: Coord = { x: state.doodle.coord.x, y: state.doodle.coord.y - 48, dx: 0, dy: -10 }
      state.balls.push(ball)
      if (state.doodle.shooting.timeout) {
        clearTimeout(state.doodle.shooting.timeout)
      }
      const timeout = setTimeout(() => {
        state.doodle.shooting.is_shooting = false
        if (state.doodle.shooting.timeout) {
          clearTimeout(state.doodle.shooting.timeout)
        }
      }, 600)
      state.doodle.shooting.timeout = timeout
      state.doodle.audioTouched = 3 // 3 for the shoot 
    }
    return { ...state }
  }
export const doodleStopShoot =
  (state: State): State => {
    state.doodle.shooting.pressed = false
    return { ...state }
  }
export const endOfGame = (state: State): boolean => true
