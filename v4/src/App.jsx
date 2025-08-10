import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container">
        <h1>Viet Trail</h1>
        <p>A web-based version of the classic Oregon Trail game.</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Start Game
          </button>
        </div>
      </div>
    </>
  )
}

export default App