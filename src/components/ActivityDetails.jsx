import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function ActivityDetails({ activities }) {
  // แยก text cards (ภาษา) ออกจาก list cards
  const listCards = activities.filter(a => !a.isText)
  const textCards = activities.filter(a => a.isText)

  return (
    <section className="activity-section">
      <motion.div
        className="activity-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* List cards */}
        {listCards.map((act, i) => (
          <motion.div key={i} className="activity-card" variants={cardVariants}>
            <h3>{act.title}</h3>
            <ul>
              {act.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Text cards (ภาษาจีน / อังกฤษ) - ยาวเต็มแถว */}
        {textCards.length > 0 && (
          <motion.div
            className="activity-card text-card"
            variants={cardVariants}
            style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}
          >
            {textCards.map((act, i) => (
              <div key={i}>
                <h3>{act.title}</h3>
                <p style={{ lineHeight: 1.8, fontSize: '0.95em' }}>{act.text}</p>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
