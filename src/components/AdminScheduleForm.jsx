import { useState } from 'react'
import { motion } from 'framer-motion'
import ScheduleTable from './ScheduleTable'
import ActivityDetails from './ActivityDetails'
import { schedules as fallbackSchedules } from '../data/schedules'

const DEFAULT_PERIODS = [
  { label: 'กิจกรรม', time: '07.50-08.30' },
  { label: 'คาบที่ 1', time: '08.30-09.20' },
  { label: 'คาบที่ 2', time: '09.20-10.10' },
  { label: 'พัก 10 นาที', time: '10.10-10.20', isBreak: true },
  { label: 'คาบที่ 3', time: '10.20-11.10' },
  { label: 'พักกลางวัน', time: '11.10-12.30', isLunch: true },
  { label: 'คาบที่ 4', time: '12.30-13.40' },
  { label: 'คาบที่ 5', time: '13.40-14.30' },
  { label: 'พัก 10 นาที', time: '14.30-14.40', isBreak: true },
  { label: 'คาบที่ 6', time: '14.40-15.30' }
]

const DAYS_CONFIG = [
  { day: 'จันทร์', dayClass: 'mon' },
  { day: 'อังคาร', dayClass: 'tue' },
  { day: 'พุธ', dayClass: 'wed' },
  { day: 'พฤหัสบดี', dayClass: 'thu' },
  { day: 'ศุกร์', dayClass: 'fri' }
]

export default function AdminScheduleForm({
  initialData,
  grade,
  term,
  gradeLabel,
  onSave,
  saving
}) {
  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'preview'

  // Initialize form state
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return JSON.parse(JSON.stringify(initialData))
    }
    // Default empty structure
    return {
      title: `ตารางเรียนชั้น${gradeLabel}`,
      subtitle: `ภาคเรียนที่ ${term} ปีการศึกษา 2569`,
      periods: JSON.parse(JSON.stringify(DEFAULT_PERIODS)),
      rows: DAYS_CONFIG.map(d => ({
        day: d.day,
        dayClass: d.dayClass,
        cells: [
          { label: 'เสริมประสบการณ์', sub: '' },
          { label: 'English', sub: '' },
          { isBreak: true },
          { label: 'ภาษาจีน', sub: '' },
          { isLunch: true },
          { label: 'นอนพักกลางวัน', isNap: true },
          { label: 'สร้างสรรค์', sub: '' },
          { isBreak: true },
          { label: 'เสรี', sub: 'เกมการศึกษา' }
        ]
      })),
      activities: [
        {
          title: '🎯 กิจกรรมเสริมประสบการณ์',
          items: ['ธรรมชาติและชนิดของต้นไม้', 'ส่วนประกอบของต้นไม้', 'การเจริญเติบโตของต้นไม้', 'ประโยชน์ของต้นไม้', 'วิธีการดูแลต้นไม้']
        },
        {
          title: '🌳 กิจกรรมกลางแจ้ง',
          items: ['เล่นเครื่องเล่นสนาม', 'โยนบอลลงตะกร้า', 'เคลื่อนไหวร่างกายอย่างอิสระ', 'การละเล่นพื้นบ้าน', 'เล่นห้องของเล่น']
        },
        {
          title: '🎨 กิจกรรมสร้างสรรค์',
          items: ['วาดภาพ', 'ระบายสีภาพ', 'ปั้นดินน้ำมัน', 'ฝนสี', 'ลากเส้นโยงเส้น']
        },
        {
          title: '🧩 กิจกรรมเสรี',
          items: ['เรียนรู้ตามมุมประสบการณ์ต่างๆ', 'หนังสือนิทาน', 'เกมจับคู่ภาพเหมือน', 'เกมจัดหมวดหมู่', 'เกมภาพตัดต่อรูปภาพ']
        },
        {
          title: '🎵 กิจกรรมเคลื่อนไหวและจังหวะ',
          items: ['เคลื่อนไหวประกอบเพลง', 'ทำท่าทางตามจังหวะ', 'ทำท่าทางตามจินตนาการ', 'เคลื่อนไหวตามจุดที่กำหนดให้']
        },
        {
          title: '🎲 เกมการศึกษา',
          items: ['จำแนกประเภท', 'จับคู่ภาพเหมือน', 'จับคู่ภาพและเงา', 'เรียงลำดับภาพเหตุการณ์']
        },
        {
          title: '🇨🇳 ภาษาจีน',
          isText: true,
          text: 'ปฏิบัติตามคำสั่ง คำขอร้องง่ายๆ ที่ใช้ในห้องเรียน ฟังและออกเสียงตามเสียงวรรณยุกต์ในภาษาจีน ร้องเพลง นับเลข และคำศัพท์ภาษาจีนง่ายๆ'
        },
        {
          title: '🇬🇧 ภาษาอังกฤษ',
          isText: true,
          text: 'ปฏิบัติตามคำสั่ง คำขอร้องง่ายๆ ในห้องเรียน ออกเสียงโฟนิกส์ ร้องเพลงภาษาอังกฤษ นับเลข และคำศัพท์หมวดหมู่ต่างๆ'
        }
      ],
      images: [
        { src: '/images/pre-k1/pic1.jpg', alt: 'ภาพน่ารักๆ ของหนู' },
        { src: '/images/pre-k1/pic2.jpg', alt: 'ภาพน่ารักๆ ของหนู' },
        { src: '/images/pre-k1/pic3.jpg', alt: 'ภาพน่ารักๆ ของหนู' },
        { src: '/images/pre-k1/pic4.jpg', alt: 'ภาพน่ารักๆ ของหนู' }
      ]
    }
  })

  // Clone template from existing schedule
  const handleCopyTemplate = (sourceKey) => {
    if (fallbackSchedules[sourceKey]) {
      const cloned = JSON.parse(JSON.stringify(fallbackSchedules[sourceKey]))
      setFormData(prev => ({
        ...cloned,
        title: `ตารางเรียนชั้น${gradeLabel}`,
        subtitle: `ภาคเรียนที่ ${term} ปีการศึกษา 2569`,
      }))
      alert(`คัดลอกโครงสร้างจาก [${sourceKey}] สำเร็จ!`)
    }
  }

  // Update cell in daily rows
  const handleCellChange = (rowIndex, cellIndex, field, value) => {
    setFormData(prev => {
      const newRows = [...prev.rows]
      const targetCell = { ...newRows[rowIndex].cells[cellIndex], [field]: value }
      newRows[rowIndex].cells[cellIndex] = targetCell
      return { ...prev, rows: newRows }
    })
  }

  // Toggle cell mode (Nap / Regular / Break)
  const handleCellMode = (rowIndex, cellIndex, mode) => {
    setFormData(prev => {
      const newRows = [...prev.rows]
      const currentCell = newRows[rowIndex].cells[cellIndex]
      if (mode === 'nap') {
        newRows[rowIndex].cells[cellIndex] = { isNap: !currentCell.isNap, label: currentCell.isNap ? 'สร้างสรรค์' : 'นอนพักกลางวัน', sub: '' }
      }
      return { ...prev, rows: newRows }
    })
  }

  // Activity list items handler
  const handleActivityItemTextChange = (actIndex, textValue) => {
    const items = textValue.split('\n').map(s => s.trim()).filter(Boolean)
    setFormData(prev => {
      const newActs = [...prev.activities]
      newActs[actIndex] = { ...newActs[actIndex], items }
      return { ...prev, activities: newActs }
    })
  }

  // Activity text handler
  const handleActivityTextChange = (actIndex, textValue) => {
    setFormData(prev => {
      const newActs = [...prev.activities]
      newActs[actIndex] = { ...newActs[actIndex], text: textValue }
      return { ...prev, activities: newActs }
    })
  }

  // Image item change
  const handleImageChange = (index, field, value) => {
    setFormData(prev => {
      const newImgs = [...prev.images]
      newImgs[index] = { ...newImgs[index], [field]: value }
      return { ...prev, images: newImgs }
    })
  }

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), { src: '', alt: 'รูปกิจกรรม' }]
    }))
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="admin-form-container">
      {/* Tab Switcher & Quick Actions */}
      <div className="admin-editor-toolbar">
        <div className="tab-buttons">
          <button
            type="button"
            className={`btn-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            ✏️ ฟอร์มแก้ไขข้อมูล
          </button>
          <button
            type="button"
            className={`btn-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ ดูตัวอย่างตาราง (Preview)
          </button>
        </div>

        <div className="template-copy-bar">
          <span>✨ แม่แบบด่วน:</span>
          <button
            type="button"
            className="btn-quick-template"
            onClick={() => handleCopyTemplate('pre-k-1')}
          >
            📋 คัดลอกจากเตรียมอนุบาล เทอม 1
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="admin-live-preview-box">
          <div className="preview-banner">
            ✨ ตัวอย่างหน้าตาตารางเรียนที่จะแสดงผลจริง
          </div>
          <div className="schedule-container">
            <div className="schedule-header">
              <h1>โรงเรียนวมินทร์วิทยา (ฮัวเหมิง)</h1>
              <h2>{formData.title} {formData.subtitle}</h2>
            </div>
            <ScheduleTable data={formData} />
            {formData.activities?.length > 0 && (
              <ActivityDetails activities={formData.activities} />
            )}
            {formData.images?.length > 0 && (
              <div className="photo-gallery" style={{ marginTop: '20px' }}>
                {formData.images.filter(img => img.src).map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.alt || 'รูปกิจกรรม'}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '14px', border: '3px solid #ff66a3' }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="admin-schedule-form">
          {/* ส่วนที่ 1: ข้อมูลทั่วไป */}
          <div className="form-section">
            <h3 className="section-title">📌 1. ข้อมูลหัวตาราง</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label>ชื่อตารางเรียน (Title)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น ตารางเรียนชั้นเตรียมอนุบาล"
                  required
                />
              </div>
              <div className="form-group">
                <label>ภาคเรียน / ปีการศึกษา (Subtitle)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="เช่น ภาคเรียนที่ 2 ปีการศึกษา 2569"
                  required
                />
              </div>
            </div>
          </div>

          {/* ส่วนที่ 2: ตารางวิชาเรียน 5 วัน */}
          <div className="form-section">
            <h3 className="section-title">📅 2. ตารางวิชาเรียนรายสัปดาห์ (จันทร์ - ศุกร์)</h3>
            <p className="section-desc">สามารถแก้ไขชื่อวิชา และชื่อคุณครูผู้สอนในแต่ละช่องได้เลย</p>

            <div className="daily-schedule-editor">
              {formData.rows.map((row, ri) => (
                <div key={ri} className={`day-editor-card day-theme-${row.dayClass}`}>
                  <div className="day-card-header">
                    <span className="day-badge">{row.day}</span>
                  </div>
                  <div className="cells-grid">
                    {row.cells.map((cell, ci) => {
                      if (cell.isBreak) {
                        return (
                          <div key={ci} className="cell-editor-item fixed-break">
                            <span className="cell-tag">☕ พัก 10 นาที</span>
                          </div>
                        )
                      }
                      if (cell.isLunch) {
                        return (
                          <div key={ci} className="cell-editor-item fixed-lunch">
                            <span className="cell-tag">🍱 พักกลางวัน</span>
                          </div>
                        )
                      }
                      return (
                        <div key={ci} className={`cell-editor-item ${cell.isNap ? 'is-nap' : ''}`}>
                          <div className="cell-inputs">
                            <input
                              type="text"
                              className="cell-input-label"
                              value={cell.label || ''}
                              onChange={(e) => handleCellChange(ri, ci, 'label', e.target.value)}
                              placeholder="ชื่อวิชา/กิจกรรม"
                            />
                            {!cell.isNap && (
                              <input
                                type="text"
                                className="cell-input-sub"
                                value={cell.sub || ''}
                                onChange={(e) => handleCellChange(ri, ci, 'sub', e.target.value)}
                                placeholder="ชื่อครู/รายละเอียด"
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            className={`btn-nap-toggle ${cell.isNap ? 'active' : ''}`}
                            onClick={() => handleCellMode(ri, ci, 'nap')}
                            title="สลับเป็นช่องนอนพักกลางวัน"
                          >
                            {cell.isNap ? '💤 เวลานอน' : '📝 วิชา'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ส่วนที่ 3: กิจกรรมเสริมการเรียนรู้ */}
          <div className="form-section">
            <h3 className="section-title">🎨 3. รายละเอียดกิจกรรมการเรียนรู้ (Activities)</h3>
            <div className="activities-editor-grid">
              {formData.activities.map((act, ai) => (
                <div key={ai} className="activity-editor-card">
                  <label className="act-label">{act.title}</label>
                  {act.isText ? (
                    <textarea
                      rows={4}
                      className="admin-textarea"
                      value={act.text || ''}
                      onChange={(e) => handleActivityTextChange(ai, e.target.value)}
                      placeholder="ระบุรายละเอียดข้อความ..."
                    />
                  ) : (
                    <div>
                      <textarea
                        rows={5}
                        className="admin-textarea"
                        value={(act.items || []).join('\n')}
                        onChange={(e) => handleActivityItemTextChange(ai, e.target.value)}
                        placeholder="พิมพ์ 1 บรรทัดต่อ 1 กิจกรรม"
                      />
                      <span className="input-hint">💡 พิมพ์ 1 กิจกรรมต่อ 1 บรรทัด (ขึ้นบรรทัดใหม่เพื่อแยกข้อ)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ส่วนที่ 4: แกลเลอรีรูปภาพ */}
          <div className="form-section">
            <h3 className="section-title">🖼️ 4. รูปภาพน่ารักๆ ประจำเทอม</h3>
            <div className="images-editor-list">
              {(formData.images || []).map((img, ii) => (
                <div key={ii} className="image-item-card">
                  <div className="img-preview-thumb">
                    {img.src ? (
                      <img src={img.src} alt={img.alt || 'preview'} onError={(e) => { e.target.style.display = 'none' }} />
                    ) : (
                      <span className="no-img">ไม่มีรูป</span>
                    )}
                  </div>
                  <div className="img-inputs">
                    <input
                      type="text"
                      className="admin-input"
                      value={img.src || ''}
                      onChange={(e) => handleImageChange(ii, 'src', e.target.value)}
                      placeholder="URL รูปภาพ เช่น /images/pre-k1/pic1.jpg หรือ ลิงก์ออนไลน์"
                    />
                    <input
                      type="text"
                      className="admin-input"
                      value={img.alt || ''}
                      onChange={(e) => handleImageChange(ii, 'alt', e.target.value)}
                      placeholder="คำอธิบายรูปภาพ"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-delete-img"
                    onClick={() => handleRemoveImage(ii)}
                    title="ลบรูปภาพนี้"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-add-img"
              onClick={handleAddImage}
            >
              ➕ เพิ่มรูปภาพ
            </button>
          </div>

          {/* Action Bar */}
          <div className="admin-action-bar">
            <motion.button
              type="submit"
              className="btn-save-schedule"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={saving}
            >
              {saving ? '⏳ กำลังบันทึกข้อมูล...' : '💾 บันทึกตารางเรียน (Save)'}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  )
}
