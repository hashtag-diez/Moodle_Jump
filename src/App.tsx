import { useRef, useEffect, useState } from 'react'
import Canvas from './components/canvas'
import './App.css'

type Size = {
  height: number
  width: number
}
const App = () => {
  const [size, setSize] = useState<Size | null>(null)
  const container = useRef<any>()
  useEffect(() => {
    setTimeout(() => {
      setSize({
        height: container.current.clientHeight,
        width: container.current.clientHeight / (16/9),
      })
    }, 100)
  })
  return (
    <div className="App" ref={container}>
      {size ? <Canvas {...size} /> : ""}
    </div>
  )
}

export default App
