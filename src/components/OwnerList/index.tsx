import { useState } from 'react'
import reactLogo from '../../assets/react.svg'
import './OwnerList.css'

function OwnerList() {
  const [count, setCount] = useState(0)

  return (
    <div className="OwnerList">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          pineOwnerListles is {count}
        </button>
        <p>
          Edit <code>src/OwnerList.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default OwnerList
