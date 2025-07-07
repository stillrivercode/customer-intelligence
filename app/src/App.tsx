import Dashboard from './components/Dashboard'
import './App.css'

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <div className="app">
      <Dashboard />
    </div>
  )
}

export default App