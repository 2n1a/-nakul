-- ===================================================
-- Supabase Setup Script for ตารางเรียนน้องณกุล
-- ===================================================
-- วิธีใช้งาน:
-- 1. ไปที่ Supabase Dashboard (https://supabase.com/dashboard)
-- 2. เลือก Project ของคุณ -> ไปที่เมนู "SQL Editor" ด้านซ้าย
-- 3. กด "New query" วางโค้ดทั้งหมดนี้แล้วกด "Run" (Ctrl + Enter)
-- ===================================================

-- 1. สร้างตาราง schedules
CREATE TABLE IF NOT EXISTS public.schedules (
    id TEXT PRIMARY KEY,               -- เช่น 'pre-k-1', 'k1-1'
    grade TEXT NOT NULL,               -- เช่น 'pre-k', 'k1'
    term INT NOT NULL,                 -- เช่น 1, 2
    title TEXT NOT NULL,
    subtitle TEXT,
    periods JSONB DEFAULT '[]'::jsonb,
    rows JSONB DEFAULT '[]'::jsonb,
    activities JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. เปิดใช้งาน Row Level Security (RLS) และอนุญาตให้ทุกคนอ่านข้อมูลได้ (Public Read)
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.schedules;
CREATE POLICY "Allow public read access" ON public.schedules
    FOR SELECT USING (true);

-- 3. ใส่ข้อมูลเริ่มต้น (เตรียมอนุบาล เทอม 1)
INSERT INTO public.schedules (id, grade, term, title, subtitle, periods, rows, activities, images)
VALUES (
    'pre-k-1',
    'pre-k',
    1,
    'ตารางเรียนชั้นเตรียมอนุบาล',
    'ภาคเรียนที่ 1 ปีการศึกษา 2569',
    '[
      { "label": "กิจกรรม", "time": "07.50-08.30" },
      { "label": "คาบที่ 1", "time": "08.30-09.20" },
      { "label": "คาบที่ 2", "time": "09.20-10.10" },
      { "label": "พัก 10 นาที", "time": "10.10-10.20", "isBreak": true },
      { "label": "คาบที่ 3", "time": "10.20-11.10" },
      { "label": "พักกลางวัน", "time": "11.10-12.30", "isLunch": true },
      { "label": "คาบที่ 4", "time": "12.30-13.40" },
      { "label": "คาบที่ 5", "time": "13.40-14.30" },
      { "label": "พัก 10 นาที", "time": "14.30-14.40", "isBreak": true },
      { "label": "คาบที่ 6", "time": "14.40-15.30" }
    ]'::jsonb,
    '[
      {
        "day": "จันทร์", "dayClass": "mon",
        "cells": [
          { "label": "เสริมประสบการณ์", "sub": "กลางแจ้ง" },
          { "label": "English", "sub": "ทิชเชอร์ศุภภวดี" },
          { "isBreak": true },
          { "label": "ภาษาจีน", "sub": "เหล่าซืออัญชิสา" },
          { "isLunch": true },
          { "label": "นอนพักกลางวัน", "isNap": true },
          { "label": "สร้างสรรค์" },
          { "isBreak": true },
          { "label": "เสรี", "sub": "เกมการศึกษา" }
        ]
      },
      {
        "day": "อังคาร", "dayClass": "tue",
        "cells": [
          { "label": "English", "sub": "ทิชเชอร์ศุภภวดี" },
          { "label": "เสริมประสบการณ์" },
          { "isBreak": true },
          { "label": "สร้างสรรค์" },
          { "isLunch": true },
          { "label": "นอนพักกลางวัน", "isNap": true },
          { "label": "ภาษาจีน", "sub": "เหล่าซืออัญชิสา" },
          { "isBreak": true },
          { "label": "เสรี", "sub": "เกมการศึกษา" }
        ]
      },
      {
        "day": "พุธ", "dayClass": "wed",
        "cells": [
          { "label": "กลางแจ้ง" },
          { "label": "English", "sub": "ทิชเชอร์ศุภภวดี" },
          { "isBreak": true },
          { "label": "ภาษาจีน", "sub": "เหล่าซือฐิติมา" },
          { "isLunch": true },
          { "label": "นอนพักกลางวัน", "isNap": true },
          { "label": "เสริมประสบการณ์" },
          { "isBreak": true },
          { "label": "เสรี", "sub": "เกมการศึกษา" }
        ]
      },
      {
        "day": "พฤหัสบดี", "dayClass": "thu",
        "cells": [
          { "label": "เสริมประสบการณ์", "sub": "กลางแจ้ง" },
          { "label": "English", "sub": "ทิชเชอร์ศุภภวดี" },
          { "isBreak": true },
          { "label": "สร้างสรรค์" },
          { "isLunch": true },
          { "label": "นอนพักกลางวัน", "isNap": true },
          { "label": "ภาษาจีน", "sub": "เหล่าซือฐิติมา" },
          { "isBreak": true },
          { "label": "เสรี", "sub": "เกมการศึกษา" }
        ]
      },
      {
        "day": "ศุกร์", "dayClass": "fri",
        "cells": [
          { "label": "กลางแจ้ง" },
          { "label": "ภาษาจีน", "sub": "เหล่าซืออัญชิสา" },
          { "isBreak": true },
          { "label": "สร้างสรรค์" },
          { "isLunch": true },
          { "label": "นอนพักกลางวัน", "isNap": true },
          { "label": "เสริมประสบการณ์" },
          { "isBreak": true },
          { "label": "เสรี", "sub": "เกมการศึกษา" }
        ]
      }
    ]'::jsonb,
    '[
      {
        "title": "🎯 กิจกรรมเสริมประสบการณ์",
        "items": ["ธรรมชาติและชนิดของต้นไม้", "ส่วนประกอบของต้นไม้", "การเจริญเติบโตของต้นไม้", "ประโยชน์ของต้นไม้", "วิธีการดูแลต้นไม้"]
      },
      {
        "title": "🌳 กิจกรรมกลางแจ้ง",
        "items": ["เล่นเครื่องเล่นสนาม", "โยนบอลลงตะกร้า", "เคลื่อนไหวร่างกายอย่างอิสระ (ต้นไม้)", "การละเล่นพื้นบ้าน งูกินหาง", "เล่นห้องของเล่น"]
      },
      {
        "title": "🎨 กิจกรรมสร้างสรรค์",
        "items": ["วาดภาพ", "ระบายสีภาพ", "ปั้นดินน้ำมัน", "ฝนสี (ใบไม้)", "ลากเส้นโยงเส้น"]
      },
      {
        "title": "🧩 กิจกรรมเสรี",
        "items": ["เรียนรู้ตามมุมประสบการณ์ต่างๆ", "นิทาน ต้นไม้มีประโยชน์", "เกมจับคู่ภาพเหมือน", "เกมจัดหมวดหมู่", "เกมภาพตัดต่อรูปภาพ"]
      },
      {
        "title": "🎵 กิจกรรมเคลื่อนไหวและจังหวะ",
        "items": ["เคลื่อนไหวประกอบเพลง", "ทำท่าทางตามจังหวะ", "ทำท่าทางตามจินตนาการ", "เคลื่อนไหวตามจุดที่กำหนดให้", "เคลื่อนไหวตามจังหวะการเคาะ"]
      },
      {
        "title": "🎲 เกมการศึกษา",
        "items": ["จำแนกประเภทของชนิดต้นไม้", "จับคู่ภาพและส่วนประกอบของต้นไม้", "จับคู่ภาพการเจริญเติบโตของต้นไม้", "จับคู่ประโยชน์ของต้นไม้", "หาภาพต้นไม้"]
      },
      {
        "title": "🇨🇳 ภาษาจีน",
        "isText": true,
        "text": "ปฏิบัติตามคำสั่ง คำขอร้องง่ายๆ ที่ใช้ในห้องเรียน เลือกภาพตามความหมายของกลุ่มคำที่ฟัง ฟังและออกเสียงตามเสียงวรรณยุกต์ในภาษาจีน ร้องเพลง นับเลข รู้จักผลไม้ และคำศัพท์ภาษาจีนง่ายๆ ได้"
      },
      {
        "title": "🇬🇧 ภาษาอังกฤษ",
        "isText": true,
        "text": "ปฏิบัติตามคำสั่ง คำขอร้องง่ายๆ ที่ใช้ในห้องเรียน เลือกภาพตามความหมายของกลุ่มคำที่ฟัง ฟังและออกเสียงตามเสียงวรรณยุกต์ในภาษาอังกฤษ ร้องเพลง นับเลข รู้จักผลไม้ และคำศัพท์ภาษาอังกฤษง่ายๆ ได้"
      }
    ]'::jsonb,
    '[
      { "src": "/images/pre-k1/pic1.jpg", "alt": "ภาพน่ารักๆ ของหนู" },
      { "src": "/images/pre-k1/pic2.jpg", "alt": "ภาพน่ารักๆ ของหนู" },
      { "src": "/images/pre-k1/pic3.jpg", "alt": "ภาพน่ารักๆ ของหนู" },
      { "src": "/images/pre-k1/pic4.jpg", "alt": "ภาพน่ารักๆ ของหนู" }
    ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    periods = EXCLUDED.periods,
    rows = EXCLUDED.rows,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images,
    updated_at = NOW();
