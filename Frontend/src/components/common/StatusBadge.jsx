/**
 * StatusBadge — renders a colored badge based on reimbursement status or role.
 */

const STATUS_CONFIG = {
  PENDING:  { label: 'Pending',  classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30'   },
  APPROVED: { label: 'Approved', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  REJECTED: { label: 'Rejected', classes: 'bg-red-500/15 text-red-400 border-red-500/30'          },
  // Role badges
  EMP: { label: 'EMP', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  RM:  { label: 'RM',  classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30'          },
  APE: { label: 'APE', classes: 'bg-violet-500/15 text-violet-400 border-violet-500/30'    },
  CFO: { label: 'CFO', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30'       },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || { label: status, classes: 'bg-gray-500/15 text-gray-400 border-gray-500/30' }

  const dotColors = {
    PENDING:  'bg-amber-400',
    APPROVED: 'bg-emerald-400',
    REJECTED: 'bg-red-400',
  }

  const sizes = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.classes} ${sizes[size]}`}>
      {dotColors[status] && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      )}
      {config.label}
    </span>
  )
}
