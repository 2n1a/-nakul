import { createClient } from '@supabase/supabase-js'
import { schedules as fallbackSchedules } from '../data/schedules'

const DEFAULT_URL = 'https://lakhlpcelvdmhduwcmyq.supabase.co'
const DEFAULT_KEY = 'sb_publishable_Gahkl8Fh22Ll0-N33kEqAA_Dkjp-YtR'

function cleanEnvValue(val, fallback) {
  if (!val || typeof val !== 'string') return fallback
  // กรณีที่ใน GitHub Secrets เผลอใส่เป็น "KEY = VALUE" ให้ตัดเอาเฉพาะ VALUE ด้านหลัง '='
  let cleaned = val.trim()
  if (cleaned.includes('=')) {
    cleaned = cleaned.split('=').slice(1).join('=').trim()
  }
  // ตัดเครื่องหมายคำพูด (quotes) ถ้ามี
  cleaned = cleaned.replace(/^['"]|['"]$/g, '').trim()
  return cleaned || fallback
}

const rawUrl = cleanEnvValue(import.meta.env.VITE_SUPABASE_URL, DEFAULT_URL)
const rawKey = cleanEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY, DEFAULT_KEY)

function initSupabase() {
  if (!rawUrl || !rawKey || typeof rawUrl !== 'string' || typeof rawKey !== 'string') {
    return null
  }
  try {
    const parsed = new URL(rawUrl)
    if (!parsed.protocol.startsWith('http')) {
      return createClient(DEFAULT_URL, DEFAULT_KEY)
    }
    return createClient(rawUrl, rawKey)
  } catch (err) {
    console.warn('Supabase URL invalid, falling back to default:', err)
    try {
      return createClient(DEFAULT_URL, DEFAULT_KEY)
    } catch {
      return null
    }
  }
}

export const supabase = initSupabase()
export const isSupabaseConfigured = Boolean(supabase)

const LOCAL_STORAGE_PREFIX = 'nakul_schedule_data_'

/**
 * ดึงข้อมูลตารางเรียนตาม grade และ term
 * ลำดับการดึง:
 * 1. Supabase (หากเชื่อมต่อไว้)
 * 2. LocalStorage (หากเคยบันทึกไว้ในเบราว์เซอร์)
 * 3. Fallback Static Data (จาก schedules.js)
 */
export async function fetchSchedule(grade, term) {
  const key = `${grade}-${term}`

  // 1. ลองดึงจาก Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('grade', grade)
        .eq('term', Number(term))
        .single()

      if (!error && data) {
        const scheduleObj = {
          title: data.title,
          subtitle: data.subtitle,
          periods: data.periods || [],
          rows: data.rows || [],
          activities: data.activities || [],
          images: data.images || [],
        }
        // บันทึก cache ลง local storage ไว้สำรอง
        try {
          localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, JSON.stringify(scheduleObj))
        } catch (e) {
          console.warn('LocalStorage save failed:', e)
        }
        return scheduleObj
      }
    } catch (err) {
      console.warn('Supabase fetch failed, trying local storage / fallback:', err)
    }
  }

  // 2. ลองดึงจาก LocalStorage
  try {
    const localData = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`)
    if (localData) {
      const parsed = JSON.parse(localData)
      if (parsed && (parsed.title || parsed.rows?.length > 0)) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e)
  }

  // 3. Fallback static data
  if (key in fallbackSchedules && fallbackSchedules[key] !== null) {
    return fallbackSchedules[key]
  }

  return undefined // ไม่มีข้อมูล
}

/**
 * บันทึกข้อมูลตารางเรียนลง Supabase และ LocalStorage
 */
export async function saveSchedule(grade, term, scheduleData) {
  const key = `${grade}-${term}`
  const payload = {
    id: key,
    grade: grade,
    term: Number(term),
    title: scheduleData.title || '',
    subtitle: scheduleData.subtitle || '',
    periods: scheduleData.periods || [],
    rows: scheduleData.rows || [],
    activities: scheduleData.activities || [],
    images: scheduleData.images || [],
    updated_at: new Date().toISOString()
  }

  // บันทึกลง LocalStorage เสมอเพื่อให้ใช้งานได้ทันที
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, JSON.stringify({
      title: payload.title,
      subtitle: payload.subtitle,
      periods: payload.periods,
      rows: payload.rows,
      activities: payload.activities,
      images: payload.images,
    }))
  } catch (e) {
    console.warn('LocalStorage save error:', e)
  }

  let savedToSupabase = false
  let supabaseError = null

  // บันทึกลง Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('schedules')
        .upsert(payload, { onConflict: 'id' })

      if (error) {
        console.error('Supabase upsert error:', error)
        supabaseError = error.message
      } else {
        savedToSupabase = true
      }
    } catch (err) {
      console.error('Supabase exception:', err)
      supabaseError = err.message
    }
  }

  return {
    success: true,
    savedToSupabase,
    supabaseError,
    data: payload
  }
}

/**
 * ดึงรายการ key ของเทอมทั้งหมดที่มีข้อมูลแล้ว
 */
export async function fetchAvailableScheduleKeys() {
  const activeKeys = new Set()

  // 1. Static keys
  Object.keys(fallbackSchedules).forEach(k => {
    if (fallbackSchedules[k] !== null) {
      activeKeys.add(k)
    }
  })

  // 2. LocalStorage keys
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i)
      if (storageKey && storageKey.startsWith(LOCAL_STORAGE_PREFIX)) {
        const itemKey = storageKey.replace(LOCAL_STORAGE_PREFIX, '')
        activeKeys.add(itemKey)
      }
    }
  } catch (e) {
    console.warn('LocalStorage scan error:', e)
  }

  // 3. Supabase keys
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('id, grade, term')

      if (!error && Array.isArray(data)) {
        data.forEach(item => {
          if (item.id) activeKeys.add(item.id)
        })
      }
    } catch (e) {
      console.warn('Supabase fetch keys error:', e)
    }
  }

  return activeKeys
}

/**
 * จัดการ Admin Authentication (user: admin, pass: 361748)
 */
const ADMIN_AUTH_KEY = 'nakul_admin_auth_session'

export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true'
  } catch {
    return false
  }
}

export function adminLogin(user, pass) {
  if (user === 'admin' && pass === '361748') {
    try {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
    } catch (e) {
      console.warn('SessionStorage error:', e)
    }
    return true
  }
  return false
}

export function adminLogout() {
  try {
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
  } catch (e) {
    console.warn('SessionStorage error:', e)
  }
}
