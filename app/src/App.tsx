import type { FC } from 'react'
import Dashboard from './components/Dashboard'
import './App.css'

const App: FC = () => {
  return (
    <div className="app">
      <Dashboard />
    </div>
  )
}

export default App