import { createClient } from '@supabase/supabase-js'
import { schedules as fallbackSchedules } from '../data/schedules'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * ดึงข้อมูลตารางเรียนตาม grade และ term
 * หากมีการตั้งค่า Supabase จะดึงจาก Supabase ก่อน
 * หากไม่ได้ตั้งค่าหรือเกิดข้อผิดพลาด จะดึงจาก fallbackSchedules
 */
export async function fetchSchedule(grade, term) {
  const key = `${grade}-${term}`

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('grade', grade)
        .eq('term', Number(term))
        .single()

      if (!error && data) {
        return {
          title: data.title,
          subtitle: data.subtitle,
          periods: data.periods || [],
          rows: data.rows || [],
          activities: data.activities || [],
          images: data.images || [],
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to static data:', err)
    }
  }

  // Fallback static data
  if (key in fallbackSchedules) {
    return fallbackSchedules[key]
  }

  return undefined // ไม่พบข้อมูล key นี้เลย
}
