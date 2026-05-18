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
              <td className={`day-col day-${row.dayClass}`}>{row.day}</td>

              {/* กิจกรรมเคลื่อนไหว (rowspan=5 แถวแรก) */}
              {ri === 0 && (
                <td rowSpan={rows.length} className="activity-routine">
                  เคลื่อนไหวและจังหวะ
                </td>
              )}

              {row.cells.map((cell, ci) => {
                if (cell.isBreak) {
                  // พัก 10 นาที - rowspan ทุกแถว
                  return ri === 0 ? (
                    <td key={ci} rowSpan={rows.length} className="break-cell">
                      พัก 10 นาที
                    </td>
                  ) : null
                }
                if (cell.isLunch) {
                  return ri === 0 ? (
                    <td key={ci} rowSpan={rows.length} className="lunch-cell">
                      พักกลางวัน
                    </td>
                  ) : null
                }
                if (cell.isNap) {
                  return (
                    <td key={ci} className="nap-cell">นอนพักกลางวัน</td>
                  )
                }
                return (
                  <td key={ci} className={`subject-cell day-${row.dayClass}`}>
                    <span className="subject-title">{cell.label}</span>
                    {cell.sub && (
                      <>
                        <br />
                        <span className="teacher-name">{cell.sub}</span>
                      </>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
