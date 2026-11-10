import { useState } from 'react'
import WorkSpace from './pages/workSpace.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WorkSpace />
    </>
  )
}

export default App
