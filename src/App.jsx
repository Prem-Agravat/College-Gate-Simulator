import { SimulationProvider, useSimulation } from './hooks/useSimulation'
import Landing from './components/Landing'
import RoleSelector from './components/RoleSelector'
import StudentSetup from './components/StudentSetup'
import VisitorSetup from './components/VisitorSetup'
import SimulationView from './components/SimulationView'
import ResultScreen from './components/ResultScreen'
import './styles/index.css'

function AppShell() {
  const {
    screen,
    role,
    enterCollege,
    selectRole,
    startWithProfile,
    changeRole,
    playAgain,
    result,
    setScreen,
  } = useSimulation()

  return (
    <div className="app-root">
      {screen === 'landing' && <Landing onEnter={enterCollege} />}
      {screen === 'roles' && <RoleSelector onSelect={selectRole} />}
      {screen === 'setup' && role === 'student' && (
        <StudentSetup onStart={startWithProfile} onBack={() => setScreen('roles')} />
      )}
      {screen === 'setup' && role === 'visitor' && (
        <VisitorSetup onStart={startWithProfile} onBack={() => setScreen('roles')} />
      )}
      {screen === 'sim' && <SimulationView />}
      {screen === 'results' && (
        <ResultScreen result={result} onPlayAgain={playAgain} onChangeRole={changeRole} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <SimulationProvider>
      <AppShell />
    </SimulationProvider>
  )
}
