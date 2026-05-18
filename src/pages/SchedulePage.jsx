import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { schedules } from '../data/schedules'
import PageTransition from '../components/PageTransition'
import ScheduleTable from '../components/ScheduleTable'
import ActivityDetails from '../components/ActivityDetails'
import BackButton from '../components/BackButton'
import ComingSoon from './ComingSoon'

export default function SchedulePage() {
  const { grade, term } = useParams()
  const key = `${grade}-${term}`
  const data = schedules[key]

  // key ไม่มีในระบบเลย → 404 กลับบ้าน
  if (!(key in schedules)) return <Navigate to="/" replace />

  // key มีแต่ data = null → Coming Soon
  if (!data) return <ComingSoon grade={grade} term={term} />

  return (
    <PageTransition>
      <div className="schedule-page">
        <div className="schedule-container">
          {/* มุมประดับ */}
          <span className="decor decor-1">🎀</span>
          <span className="decor decor-2">🌸</span>
          <span className="decor decor-3">✨</span>
          <span className="decor decor-4">🍓</span>

          {/* หัวหน้า */}
          <div className="schedule-header">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              โรงเรียนวมินทร์วิทยา (ฮัวเหมิง)
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {data.title} {data.subtitle}
            </motion.h2>
          </div>

          {/* ตารางเรียน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ScheduleTable data={data} />
          </motion.div>

          {/* รายละเอียดกิจกรรม */}
          {data.activities?.length > 0 && (
            <ActivityDetails activities={data.activities} />
          )}

          {/* รูปภาพประจำเทอม (แยกอิสระ) */}
          {data.images?.length > 0 && (
            <motion.div
              className="photo-gallery"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {data.images.map((img, i) => (
                <motion.img
                  key={i}
                  src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`}
                  alt={img.alt}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.4, type: 'spring' }}
                  whileHover={{ scale: 1.12, rotate: 5 }}
                />
              ))}
            </motion.div>
          )}

          <BackButton />
        </div>
      </div>
    </PageTransition>
  )
}
