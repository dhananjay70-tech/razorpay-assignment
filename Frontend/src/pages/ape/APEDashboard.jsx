import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckSquare, Clock, ArrowRight, TrendingUp } from 'lucide-react'

import { listReimbursements } from '../../services/reimbursement.service'
import DashboardCard from '../../components/common/DashboardCard'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function APEDashboard() {
  const [reimbursements, setReimbursements] = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    listReimbursements()
      .then(setReimbursements)
      .catch(() => setReimbursements([]))
      .finally(() => setLoading(false))
  }, [])

  const pending  = reimbursements.filter(r => r.status === 'PENDING')
  const approved = reimbursements.filter(r => r.status === 'APPROVED')
  const pendingValue = pending.reduce((a, r) => a + (Number(r.amount) || 0), 0)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">APE Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Review RM-approved reimbursements awaiting your final approval.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="Awaiting Review"  value={pending.length}  icon={Clock}       color="amber"   index={0} />
        <DashboardCard title="Settled / Approved" value={approved.length} icon={CheckSquare} color="emerald" index={1} />
        <DashboardCard
          title="Pending Value"
          value={`₹${pendingValue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="indigo"
          index={2}
        />
      </div>

      {/* Recent queue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Approval Queue</h2>
          <Link
            to="/ape/approvals"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : pending.length === 0 ? (
          <EmptyState title="Queue is empty" description="No requests awaiting your review." icon={CheckSquare} />
        ) : (
          <div className="divide-y divide-white/5">
            {pending.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{r.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{r.description}</p>
                </div>
                <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    ₹{Number(r.amount).toLocaleString('en-IN')}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
