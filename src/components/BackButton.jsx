import { Link } from 'react-router-dom'

export default function BackButton() {
  return (
    <div className="back-btn-wrap">
      <Link to="/" className="back-btn">
        ⬅️ กลับหน้าชั้นเรียนกันค่ะ
      </Link>
    </div>
  )
}
