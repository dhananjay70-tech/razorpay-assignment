import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Clock, CheckCircle, ArrowRight } from 'lucide-react'

import { listEmployees } from '../../services/employee.service'
import { listReimbursements } from '../../services/reimbursement.service'
import DashboardCard from '../../components/common/DashboardCard'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function RMDashboard() {
  const [employees,       setEmployees]       = useState([])
  const [reimbursements,  setReimbursements]  = useState([])
  const [loading,         setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([listEmployees(), listReimbursements()])
      .then(([emps, reimbs]) => {
        setEmployees(emps)
        setReimbursements(reimbs)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pending  = reimbursements.filter(r => r.status === 'PENDING')
  const recent   = reimbursements.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">
          Manager Dashboard 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Review pending requests from your team members.
        </p>
      </motion.div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="My Employees"    value={employees.length}    icon={Users}        color="blue"   index={0} />
        <DashboardCard title="Pending Reviews" value={pending.length}      icon={Clock}        color="amber"  index={1} />
        <DashboardCard title="Total Requests"  value={reimbursements.length} icon={CheckCircle} color="indigo" index={2} />
      </div>

      {/* ── Pending requests ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Pending Reviews</h2>
          <Link
            to="/rm/reimbursements"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : recent.length === 0 ? (
          <EmptyState
            title="No pending requests"
            description="All caught up! No requests awaiting your review."
            icon={CheckCircle}
          />
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((r) => (
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
