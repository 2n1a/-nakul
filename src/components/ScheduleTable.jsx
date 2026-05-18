import SparkleCell from './SparkleCell'

// ตารางเรียนรายสัปดาห์
export default function ScheduleTable({ data }) {
  const { periods, rows } = data

  return (
    <div className="table-wrapper">
      <table className="schedule-table">
        <thead>
          {/* แถวหัว: ชื่อคาบ */}
          <tr>
            <th>วัน</th>
            {periods.map((p, i) => (
              <th key={i}>{p.label}</th>
            ))}
          </tr>
          {/* แถวเวลา */}
          <tr>
            <th className="time-col">เวลา</th>
            {periods.map((p, i) => (
              <th key={i} className="time-col">{p.time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {/* ชื่อวัน */}
              <SparkleCell className={`day-col day-${row.dayClass}`}>
                {row.day}
              </SparkleCell>

              {/* กิจกรรมเคลื่อนไหว (rowspan=5 แถวแรก) */}
              {ri === 0 && (
                <td rowSpan={rows.length} className="activity-routine">
                  เคลื่อนไหวและจังหวะ
                </td>
              )}

              {row.cells.map((cell, ci) => {
                // พัก 10 นาที - rowspan ทุกแถว
                if (cell.isBreak) {
                  return ri === 0 ? (
                    <td key={ci} rowSpan={rows.length} className="break-cell">
                      พัก 10 นาที
                    </td>
                  ) : null
                }
                // พักกลางวัน
                if (cell.isLunch) {
                  return ri === 0 ? (
                    <td key={ci} rowSpan={rows.length} className="lunch-cell">
                      พักกลางวัน
                    </td>
                  ) : null
                }
                // นอนพักกลางวัน
                if (cell.isNap) {
                  return (
                    <SparkleCell key={ci} className="nap-cell">
                      นอนพักกลางวัน
                    </SparkleCell>
                  )
                }
                // วิชาทั่วไป — ใช้ SparkleCell
                return (
                  <SparkleCell key={ci} className={`subject-cell day-${row.dayClass}`}>
                    <span className="subject-title">{cell.label}</span>
                    {cell.sub && (
                      <>
                        <br />
                        <span className="teacher-name">{cell.sub}</span>
                      </>
                    )}
                  </SparkleCell>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
