import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { levels } from '../data/schedules'
import { fetchSchedule, saveSchedule, fetchAvailableScheduleKeys, adminLogout, isSupabaseConfigured } from '../lib/supabase'
import AdminScheduleForm from '../components/AdminScheduleForm'
import PageTransition from '../components/PageTransition'

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [selectedGrade, setSelectedGrade] = useState('pre-k')
  const [selectedTerm, setSelectedTerm] = useState(2) // Default to term 2 as requested!
  const [scheduleData, setScheduleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeKeys, setActiveKeys] = useState(new Set())
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')
  const [saveWarningMsg, setSaveWarningMsg] = useState('')

  const selectedLevel = levels.find(l => l.id === selectedGrade) || levels[0]
  const currentKey = `${selectedGrade}-${selectedTerm}`
  const hasExistingData = activeKeys.has(currentKey)

  // Load available keys
  const reloadAvailableKeys = async () => {
    const keys = await fetchAvailableScheduleKeys()
    setActiveKeys(keys)
  }

  useEffect(() => {
    reloadAvailableKeys()
  }, [])

  // Fetch schedule data when grade/term change
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setSaveSuccessMsg('')
    setSaveWarningMsg('')

    fetchSchedule(selectedGrade, selectedTerm).then(res => {
      if (isMounted) {
        setScheduleData(res || null)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [selectedGrade, selectedTerm])

  const handleSave = async (formData) => {
    setSaving(true)
    setSaveSuccessMsg('')
    setSaveWarningMsg('')

    try {
      const result = await saveSchedule(selectedGrade, selectedTerm, formData)
      if (result.success) {
        setScheduleData(formData)
        await reloadAvailableKeys()
        if (result.savedToSupabase) {
          setSaveSuccessMsg(`บันทึกข้อมูล ${selectedLevel.label} เทอม ${selectedTerm} ลงฐานข้อมูลออนไลน์ (Supabase) เรียบร้อยแล้ว! 🎉`)
        } else {
          setSaveSuccessMsg(`บันทึกข้อมูล ${selectedLevel.label} เทอม ${selectedTerm} ลงในเบราว์เซอร์เครื่องนี้เรียบร้อยแล้ว! 💾`)
          if (result.supabaseError) {
            setSaveWarningMsg(`⚠️ ไม่สามารถบันทึกลงฐานข้อมูลออนไลน์ (Supabase) ได้: ${result.supabaseError} (กรุณาตรวจสอบว่าได้รันไฟล์ supabase_setup.sql ใน Supabase SQL Editor หรือยัง)`)
          }
        }
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoutClick = () => {
    adminLogout()
    if (onLogout) {
      onLogout()
    } else {
      navigate('/')
    }
  }

  return (
    <PageTransition>
      <div className="admin-dashboard-page">
        {/* Admin Header */}
        <header className="admin-topbar">
          <div className="admin-brand">
            <span className="brand-icon">🎒✨</span>
            <div>
              <h2>ระบบจัดการตารางเรียน (Admin Panel)</h2>
              <span className="admin-status-badge">
                {isSupabaseConfigured ? '🟢 เชื่อมต่อ Supabase แล้ว' : '🟠 โหมด Local Storage'}
              </span>
            </div>
          </div>

          <div className="admin-top-actions">
            <Link to="/" className="btn-nav-home" target="_blank">
              🌐 ดูหน้าเว็บหลัก
            </Link>
            <button onClick={handleLogoutClick} className="btn-admin-logout">
              🚪 ออกจากระบบ
            </button>
          </div>
        </header>

        <main className="admin-main-content">
          {/* แถบเลือกระดับชั้นและเทอม */}
          <section className="grade-term-selector-card">
            <div className="selector-group">
              <label className="selector-label">1. เลือกระดับชั้นเรียน:</label>
              <div className="grade-pill-group">
                {levels.map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    className={`btn-grade-pill ${selectedGrade === lvl.id ? 'active' : ''}`}
                    onClick={() => setSelectedGrade(lvl.id)}
                  >
                    <span className="pill-emoji">{lvl.emoji}</span>
                    <span className="pill-label">{lvl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="selector-group">
              <label className="selector-label">2. เลือกภาคเรียน (เทอม):</label>
              <div className="term-pill-group">
                {[1, 2].map(t => {
                  const key = `${selectedGrade}-${t}`
                  const exists = activeKeys.has(key)
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`btn-term-pill ${selectedTerm === t ? 'active' : ''}`}
                      onClick={() => setSelectedTerm(t)}
                    >
                      <span>เทอม {t}</span>
                      <span className={`badge-status ${exists ? 'has-data' : 'empty'}`}>
                        {exists ? 'มีข้อมูลแล้ว ✨' : 'ว่าง 🚧'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="current-selection-banner">
              <span>กำลังแก้ไข: </span>
              <strong>{selectedLevel.emoji} {selectedLevel.label} - เทอม {selectedTerm}</strong>
              {hasExistingData ? (
                <span className="status-tag active">✅ มีข้อมูลในระบบแล้ว</span>
              ) : (
                <span className="status-tag draft">📝 ยังไม่มีข้อมูล (สามารถกรอกและบันทึกได้ทันที)</span>
              )}
            </div>
          </section>

          {/* Success Notification Alert */}
          <AnimatePresence>
            {saveSuccessMsg && (
              <motion.div
                className="admin-success-banner"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <div className="success-content">
                  <span className="success-icon">💖</span>
                  <div className="success-text">
                    <strong>{saveSuccessMsg}</strong>
                    <p>คุณสามารถเปิดดูหน้าแสดงผลจริงได้ทันที</p>
                    {saveWarningMsg && (
                      <p style={{ color: '#c62828', marginTop: '6px', fontWeight: 500 }}>
                        {saveWarningMsg}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  to={`/schedule/${selectedGrade}/${selectedTerm}`}
                  target="_blank"
                  className="btn-view-live"
                >
                  🚀 เปิดดูหน้าเว็บจริง ➔
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Area */}
          {loading ? (
            <div className="admin-loading-box">
              <span className="loading-icon">⏳</span>
              <p>กำลังโหลดข้อมูลตารางเรียน...</p>
            </div>
          ) : (
            <AdminScheduleForm
              key={`${selectedGrade}-${selectedTerm}-${scheduleData ? 'data' : 'empty'}`}
              initialData={scheduleData}
              grade={selectedGrade}
              term={selectedTerm}
              gradeLabel={selectedLevel.label}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </main>
      </div>
    </PageTransition>
  )
}
