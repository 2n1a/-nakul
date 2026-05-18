import { useEffect, useRef } from 'react'

export default function StarBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // === Twinkle Stars ===
    const STAR_COUNT = 120
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       Math.random() * 1.8 + 0.3,
      alpha:   Math.random(),
      speed:   Math.random() * 0.012 + 0.004,
      rising:  Math.random() > 0.5,
    }))

    // === Shooting Stars ===
    const MAX_SHOOTERS = 5
    const shooters = []

    const spawnShooter = () => {
      const angle = (Math.random() * 20 + 20) * (Math.PI / 180) // 20-40 deg
      const speed = Math.random() * 8 + 10
      return {
        x:      Math.random() * window.innerWidth * 0.8,
        y:      Math.random() * window.innerHeight * 0.4,
        vx:     Math.cos(angle) * speed,
        vy:     Math.sin(angle) * speed,
        len:    Math.random() * 120 + 80,
        alpha:  1,
        width:  Math.random() * 1.5 + 0.8,
        active: true,
      }
    }

    // เพิ่มดาวตกทุก 1.2-2.5 วินาที
    let lastSpawn = 0
    const spawnInterval = () => Math.random() * 1300 + 1200

    // color palette (pink tones)
    const starColors = [
      '#ffb3d1', '#ff99c2', '#ff66a3',
      '#ffd6e8', '#ffffff', '#ffe0ef',
    ]

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // --- Twinkle stars ---
      stars.forEach(s => {
        s.alpha += s.rising ? s.speed : -s.speed
        if (s.alpha >= 1) { s.alpha = 1; s.rising = false }
        if (s.alpha <= 0) { s.alpha = 0; s.rising = true  }

        const color = starColors[Math.floor(Math.random() * starColors.length * 0.9) % starColors.length]
        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.restore()
      })

      // --- Spawn new shooting star ---
      if (timestamp - lastSpawn > spawnInterval() && shooters.filter(s => s.active).length < MAX_SHOOTERS) {
        shooters.push(spawnShooter())
        lastSpawn = timestamp
      }

      // --- Draw shooting stars ---
      shooters.forEach(s => {
        if (!s.active) return

        // tail gradient
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * (s.len / 12), s.y - s.vy * (s.len / 12))
        grad.addColorStop(0, `rgba(255, 200, 220, ${s.alpha})`)
        grad.addColorStop(0.3, `rgba(255, 150, 190, ${s.alpha * 0.6})`)
        grad.addColorStop(1, `rgba(255, 102, 163, 0)`)

        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.strokeStyle = grad
        ctx.lineWidth = s.width
        ctx.lineCap = 'round'
        ctx.shadowColor = '#ff99c2'
        ctx.shadowBlur = 8

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * (s.len / 12), s.y - s.vy * (s.len / 12))
        ctx.stroke()

        // head glow
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.width * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 230, 240, ${s.alpha})`
        ctx.fill()
        ctx.restore()

        // move
        s.x += s.vx
        s.y += s.vy
        s.alpha -= 0.012

        if (s.alpha <= 0 || s.x > canvas.width + 50 || s.y > canvas.height + 50) {
          s.active = false
        }
      })

      // cleanup dead shooters
      if (shooters.length > 20) shooters.splice(0, 10)

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
