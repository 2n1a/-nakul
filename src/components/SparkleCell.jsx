import { useState, useCallback } from 'react'
import './SparkleCell.css'

const STAR_SHAPES = ['★', '✦', '✧', '⭐', '💫', '✨']
const COLORS = ['#ff66a3', '#ff99c2', '#ffb3d1', '#ffd6e8', '#ffffff', '#ff3385', '#ffcc00']

let uid = 0

export default function SparkleCell({ children, className = '', ...props }) {
  const [sparks, setSparks] = useState([])

  const burst = useCallback(() => {
    const count = 10
    const newSparks = Array.from({ length: count }, () => {
      const angle  = Math.random() * 360
      const dist   = Math.random() * 52 + 24      // px จาก center
      const size   = Math.random() * 14 + 10       // font size
      const dur    = Math.random() * 400 + 450     // ms
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)]
      const shape  = STAR_SHAPES[Math.floor(Math.random() * STAR_SHAPES.length)]
      const id     = uid++
      const rad    = (angle * Math.PI) / 180
      const tx     = Math.cos(rad) * dist
      const ty     = Math.sin(rad) * dist

      return { id, shape, size, color, dur, tx, ty }
    })

    setSparks(prev => [...prev, ...newSparks])

    // ลบออกหลัง animation จบ
    const maxDur = Math.max(...newSparks.map(s => s.dur)) + 50
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.find(n => n.id === s.id)))
    }, maxDur)
  }, [])

  return (
    <td className={`sparkle-cell ${className}`} onMouseEnter={burst} {...props}>
      {/* Star particles */}
      {sparks.map(s => (
        <span
          key={s.id}
          className="spark"
          style={{
            fontSize:    `${s.size}px`,
            color:       s.color,
            '--tx':      `${s.tx}px`,
            '--ty':      `${s.ty}px`,
            '--dur':     `${s.dur}ms`,
            textShadow:  `0 0 6px ${s.color}`,
          }}
        >
          {s.shape}
        </span>
      ))}
      {children}
    </td>
  )
}
