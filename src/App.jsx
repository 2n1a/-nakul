import { HashRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import SchedulePage from './pages/SchedulePage'

export default function App() {
  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule/:grade/:term" element={<SchedulePage />} />
        </Routes>
      </AnimatePresence>
    </HashRouter>
  )
}
