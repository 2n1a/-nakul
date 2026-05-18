import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const levelNames = {
  'pre-k': 'เตรียมอนุบาล',
  'k1': 'อนุบาล 1',
  'k2': 'อนุบาล 2',
  'k3': 'อนุบาล 3',
}

export default function ComingSoon({ grade, term }) {
  const levelLabel = levelNames[grade] ?? grade
  return (
    <PageTransition>
      <div className="coming-soon-page">
        <motion.div
          className="coming-soon-card"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.35 }}
        >
          <span className="icon">🚧✨</span>
          <h1>กำลังจัดทำตารางเรียน</h1>
          <p>
            {levelLabel} เทอม {term}<br />
            คุณแม่ยังไม่ได้อัปเดตตารางเรียนของเทอมนี้นะคะ รอก่อนน้าาา 🥰
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/" className="back-btn">⬅️ กลับหน้าหลัก</Link>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
