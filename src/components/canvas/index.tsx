import * as conf from "./conf";
import { useRef, useEffect } from "react";
import {
  State,
  step,
  doodleMove,
  doodleStopMove,
  doodleShoot,
  doodleStopShoot,
  Plat,
} from "./state";
import {
  render,
  render_game_over,
  render_menu,
  setPlayClicked,
  setShowCollisions,
} from "./renderer";

const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    requestAnimationFrame(() => iterate(ctx));
  };

// function wait(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

const Canvas = ({ height, width }: { height: number; width: number }) => {
  const initialState: State = {
    view: "Accueil",
    doodle: {
      flying: false,
      life: conf.BALLLIFE,
      coord: {
        x: 400,
        y: height - 400,
        dx: 0,
        dy: 7,
      },
      stopMoving: true,
      direction: "LEFT",
      shooting: {
        is_shooting: false,
        pressed: false,
      },
    },
    scroll: {
      id_touched_ennemi: -1,
      id_touched: -1,
      doScroll: false,
      savedDy: 0,
    },
    seed: 0,
    size: { height, width },
    platforms: new Array(50).fill(0).map((v, i) => {
      if (i > 2) {
        let minX = 50;
        let maxX = width - 55;
        let averageY = 50;
        return {
          hasSpring: Math.floor(Math.random() * 30) > 28 ? true : false,
          coord: {
            x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
            y: height - (i + 1) * averageY,
            dx: 0,
            dy: 0,
          },
        };
      } else {
        return {
          hasSpring: false,
          coord: {
            x: ((1 % 2) + 1) * 200,
            y: height - 100,
            dx: 0,
            dy: 0,
          },
        };
      }
    }),
    balls: [],
    ennemies: [],
  };

  const ref = useRef<any>();
  const state = useRef<State>(initialState);

  const iterate = (ctx: CanvasRenderingContext2D) => {
    if (state.current.view === "Accueil") {
      render_menu(ctx)(state.current);
    } else if (state.current.view === "InGame") {
      state.current = step(state.current);
      render(ctx)(state.current);
    } else {
      render_game_over(ctx)(state.current);
    }
    requestAnimationFrame(() => iterate(ctx));
  };

  const handleRestart = () => {
    const newGame = initialState
    newGame.view = "InGame"
    state.current =newGame 
  };
  const onMove = (e: KeyboardEvent) => {
    const { code } = e;

    if (code == "KeyA" || code == "KeyD") {
      state.current = doodleMove(state.current, e);
    } 
  };
  const onShoot = (e: KeyboardEvent) => {
    const { code } = e;

    if (code == "Space") {
      state.current = doodleShoot(state.current);
    }
  };
  const onStopShoot = (e: KeyboardEvent) => {
    const { code } = e;
    if (code == "Space") {
      state.current = doodleStopShoot(state.current);
    }
  };
  const onStop = (e: KeyboardEvent) => {
    const { code } = e;

    if (code == "KeyA" || code == "KeyD") {
      state.current = doodleStopMove(state.current);
    }
  };
  const onCollisions = (e: KeyboardEvent) => {
    const { code } = e;

    if (code == "KeyC") {
      setShowCollisions();
    }
  };
  // async function handleClick(event: MouseEvent) {
  //   const x = event.clientX;
  //   const y = event.clientY;

  //   if (state.current.view === "Accueil") {
  //     if (x >= 965 && x <= 1180 && y >= 640 && y <= 720) {
  //       setPlayClicked();
  //       await wait(100);
  //       state.current.view = "InGame";
  //     }
  //   }

  //   if (state.current.view === "GameOver") {
  //     if (x >= 865 && x <= 1085 && y >= 695 && y <= 770) {
  //       await wait(100);
  //       alert("comment reinitialiser tout mdr?");
  //     }
  //   }
  // }
  useEffect(() => {
    if (ref.current) {
      initCanvas(iterate)(ref.current);
      ref.current.addEventListener("keydown", onMove);
      ref.current.addEventListener("keydown", onShoot);
      ref.current.addEventListener("keyup", onStop);
      ref.current.addEventListener("keyup", onStopShoot);
      ref.current.addEventListener("keydown", onCollisions);
      // ref.current.addEventListener("click", handleClick);
    }
    return () => {
      ref.current.removeEventListener("click", onMove);
      ref.current.removeEventListener("mousemove", onMove);
      // ref.current.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <>
      {state.current.view == "GameOver" ? (
        <button
          onClick={() => handleRestart()}
          className="invisible"
          style={{ top: `${height - 200}px`, left: `${width + 140}px` }}
        ></button>
      ) : (
        ""
      )}
       {state.current.view == "Accueil" ? (
        <button
          onClick={() => handleRestart()}
          className="invisible"
          style={{ top: `${height - 250}px`, left: `${width + 250}px` }}
        ></button>
      ) : (
        ""
      )}
      <canvas height={height} width={width} ref={ref} tabIndex={1} />
    </>
  );
};

export default Canvas;
