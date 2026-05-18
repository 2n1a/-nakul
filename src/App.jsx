import { HashRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import SchedulePage from './pages/SchedulePage'
import StarBackground from './components/StarBackground'

export default function App() {
  return (
    <HashRouter>
      <StarBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule/:grade/:term" element={<SchedulePage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </HashRouter>
  )
}
