import { Badge } from 'antd'
import { motion } from 'framer-motion'

interface QuestionPromptProps {
  text: string | undefined
  phase?: 'learn' | 'review'
}

const PHASE_CONFIG = {
  learn: { label: 'Learn', color: '#6366F1' },
  review: { label: 'Review', color: '#10b981' },
}

const QuestionPrompt = ({ text, phase = 'learn' }: QuestionPromptProps) => {
  const config = PHASE_CONFIG[phase]

  return (
    <div className="flex flex-col items-center gap-3">
      <Badge
        count={config.label}
        style={{ backgroundColor: config.color, fontWeight: 600, fontSize: 12 }}
      />
      <motion.span
        key={text}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-2xl font-bold text-white text-center leading-snug"
      >
        {text}
      </motion.span>
    </div>
  )
}

export default QuestionPrompt
