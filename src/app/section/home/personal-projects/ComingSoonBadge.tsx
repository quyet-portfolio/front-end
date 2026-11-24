import { cn } from '@/src/lib/utils'

const ComingSoonBadge = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full bg-purple/10 px-2.5 py-1 text-xs font-semibold leading-4 text-purple',
      className,
    )}
  >
    <span aria-hidden className="size-1.5 rounded-full bg-purple" />
    Coming soon
  </span>
)

export default ComingSoonBadge
