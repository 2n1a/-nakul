import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { levels } from '../data/schedules'
import PageTransition from '../components/PageTransition'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } },
}

// เทอมที่มีข้อมูลแล้ว
const ACTIVE_TERMS = new Set(['pre-k-1'])

export default function Home() {
  return (
    <PageTransition>
      <div className="home-page">
        <div className="home-header">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            🎒 ตารางเรียนของน้องณกุล 🎒
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            รวมตารางเรียนตั้งแต่เตรียมอนุบาล จนถึง อนุบาล 3
          </motion.p>
        </div>

        <motion.div
          className="level-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {levels.map(level => (
            <motion.div key={level.id} className="level-card" variants={cardVariants}
              whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(255,105,180,0.22)', borderColor: '#ff66a3' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="level-card-emoji">{level.emoji}</span>
              <h2>{level.label}</h2>
              <div className="term-buttons">
                {level.terms.map(term => {
                  const key = `${level.id}-${term}`
                  const isActive = ACTIVE_TERMS.has(key)
                  return (
                    <Link
                      key={term}
                      to={`/schedule/${level.id}/${term}`}
                      className={`btn-term${isActive ? ' active' : ''}`}
                    >
                      {isActive ? `เทอม ${term} (ล่าสุด ✨)` : `เทอม ${term}`}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="home-footer">
          <p>จัดทำด้วยความรัก 💖 สำหรับน้องณกุลคนเก่ง</p>
        </div>
      </div>
    </PageTransition>
  )
}
