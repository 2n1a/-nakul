import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminLogin } from '../lib/supabase'
import PageTransition from '../components/PageTransition'

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const success = adminLogin(username.trim(), password.trim())
      if (success) {
        if (onLoginSuccess) {
          onLoginSuccess()
        }
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
      }
      setLoading(false)
    }, 300)
  }

  return (
    <PageTransition>
      <div className="admin-login-page">
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="admin-card-header">
            <span className="admin-login-icon">🔐✨</span>
            <h1>เข้าสู่ระบบจัดการ (Admin)</h1>
            <p>ระบบบันทึกและแก้ไขตารางเรียนน้องณกุล</p>
          </div>

          {error && (
            <motion.div
              className="admin-error-alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="admin-user">ชื่อผู้ใช้งาน (Username)</label>
              <input
                id="admin-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ระบุ username (admin)"
                required
                autoComplete="username"
                className="admin-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-pass">รหัสผ่าน (Password)</label>
              <div className="password-input-wrapper">
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ระบุรหัสผ่าน"
                  required
                  autoComplete="current-password"
                  className="admin-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-toggle-password"
                  tabIndex="-1"
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-admin-submit"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(255, 51, 133, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'กำลังตรวจสอบ...' : '💖 เข้าสู่ระบบ'}
            </motion.button>
          </form>

          <div className="admin-card-footer">
            <Link to="/" className="btn-back-home">
              ⬅️ กลับหน้าหลัก
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
