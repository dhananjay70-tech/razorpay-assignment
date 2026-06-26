import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, XCircle, PlusCircle, ArrowRight } from 'lucide-react'

import { listReimbursements } from '../../services/reimbursement.service'
import { useAuth } from '../../hooks/useAuth'
import DashboardCard from '../../components/common/DashboardCard'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function EMPDashboard() {
  const { user } = useAuth()
  const [reimbursements, setReimbursements] = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    listReimbursements()
      .then(setReimbursements)
      .catch(() => setReimbursements([]))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total:    reimbursements.length,
    pending:  reimbursements.filter(r => r.status === 'PENDING').length,
    approved: reimbursements.filter(r => r.status === 'APPROVED').length,
    rejected: reimbursements.filter(r => r.status === 'REJECTED').length,
  }

  const recent = reimbursements.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good day, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's an overview of your reimbursements.</p>
        </div>
        <Link
          to="/emp/raise"
          className="hidden sm:inline-flex items-center gap-2 gradient-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle size={16} />
          Raise Request
        </Link>
      </motion.div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Requests"   value={stats.total}    icon={FileText}    color="indigo"  index={0} />
        <DashboardCard title="Pending"          value={stats.pending}  icon={Clock}       color="amber"   index={1} />
        <DashboardCard title="Approved"         value={stats.approved} icon={CheckCircle} color="emerald" index={2} />
        <DashboardCard title="Rejected"         value={stats.rejected} icon={XCircle}     color="red"     index={3} />
      </div>

      {/* ── Recent requests ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Recent Requests</h2>
          <Link
            to="/emp/reimbursements"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : recent.length === 0 ? (
          <EmptyState
            title="No reimbursements yet"
            description="Start by raising your first reimbursement request."
            icon={FileText}
          />
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{r.title}</p>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{r.description}</p>
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
