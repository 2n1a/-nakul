import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchSchedule } from '../lib/supabase'
import { schedules as fallbackSchedules } from '../data/schedules'
import PageTransition from '../components/PageTransition'
import ScheduleTable from '../components/ScheduleTable'
import ActivityDetails from '../components/ActivityDetails'
import BackButton from '../components/BackButton'
import ComingSoon from './ComingSoon'

export default function SchedulePage() {
  const { grade, term } = useParams()
  const key = `${grade}-${term}`
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetchSchedule(grade, term).then(result => {
      if (isMounted) {
        setData(result)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [grade, term])

  // ตรวจสอบความถูกต้องของ grade และ term
  const validGrades = ['pre-k', 'k1', 'k2', 'k3']
  const isValidGrade = validGrades.includes(grade)
  const isValidTerm = [1, 2].includes(Number(term))

  if (!isValidGrade || !isValidTerm) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="schedule-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', color: '#ff66a3', fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>⏳</span>
            กำลังโหลดตารางเรียน...
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  // หากไม่มีข้อมูลในเทอมนี้ → แสดงหน้า Coming Soon
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
              {data.images.map((img, i) => {
                const isExternal = img.src.startsWith('http://') || img.src.startsWith('https://')
                const imageSrc = isExternal
                  ? img.src
                  : `${import.meta.env.BASE_URL}${img.src.replace(/^\//, '')}`

                return (
                  <motion.img
                    key={i}
                    src={imageSrc}
                    alt={img.alt}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.4, type: 'spring' }}
                    whileHover={{ scale: 1.12, rotate: 5 }}
                  />
                )
              })}
            </motion.div>
          )}

          <BackButton />
        </div>
      </div>
    </PageTransition>
  )
}

