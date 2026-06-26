import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Shield, FileText, IndianRupee, ArrowRight, UserCheck } from 'lucide-react'

import { listEmployees } from '../../services/employee.service'
import { listReimbursements } from '../../services/reimbursement.service'
import DashboardCard from '../../components/common/DashboardCard'
import Loader from '../../components/common/Loader'

export default function CFODashboard() {
  const [employees, setEmployees] = useState([])
  const [reimbursements, setReimbursements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listEmployees(), listReimbursements()])
      .then(([empData, reimbData]) => {
        setEmployees(empData || [])
        setReimbursements(reimbData || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalEmployees = employees.length
  const emps = employees.filter(e => e.role === 'EMP').length
  const rms = employees.filter(e => e.role === 'RM').length
  const apes = employees.filter(e => e.role === 'APE').length
  const cfos = employees.filter(e => e.role === 'CFO').length

  const totalApprovedAmount = reimbursements.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
  const totalApprovedCount = reimbursements.length

  if (loading) return <Loader text="Loading CFO Dashboard..." />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-outfit">CFO Command Center</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage system roles, assign Reporting Managers, and view organizational payout reports.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Users"
          value={totalEmployees}
          icon={Users}
          description={`${emps} EMPs, ${rms} RMs, ${apes} APEs`}
        />
        <DashboardCard
          title="Approved Claims"
          value={totalApprovedCount}
          icon={FileText}
          description="Settled by Accounts Payable"
        />
        <DashboardCard
          title="Total Disbursed"
          value={`₹${totalApprovedAmount.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          description="Total settled budget"
          className="lg:col-span-2 border-emerald-500/20 bg-emerald-950/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-white">Administrative Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/cfo/assign-roles">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-gray-900 border border-white/10 rounded-2xl hover:border-violet-500/50 hover:bg-violet-950/10 transition-all cursor-pointer group"
              >
                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl w-fit group-hover:bg-violet-500 group-hover:text-white transition-colors">
                  <Shield size={20} />
                </div>
                <h3 className="text-white font-semibold mt-4">Assign & Modify Roles</h3>
                <p className="text-gray-400 text-xs mt-1">Promote employees to Reporting Managers or Accounts Payable.</p>
                <span className="text-violet-400 text-xs font-semibold inline-flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                  Access Role Manager <ArrowRight size={12} />
                </span>
              </motion.div>
            </Link>

            <Link to="/cfo/assign-employees">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-gray-900 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-950/10 transition-all cursor-pointer group"
              >
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <UserCheck size={20} />
                </div>
                <h3 className="text-white font-semibold mt-4">Employee Mapping</h3>
                <p className="text-gray-400 text-xs mt-1">Assign employees to their respective Reporting Managers.</p>
                <span className="text-blue-400 text-xs font-semibold inline-flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                  Access Mapping Tool <ArrowRight size={12} />
                </span>
              </motion.div>
            </Link>
          </div>

          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-base">Recent Settled Reimbursements</h3>
              <Link to="/cfo/reports" className="text-violet-400 hover:text-violet-300 text-xs font-medium inline-flex items-center gap-1">
                View Reports <ArrowRight size={12} />
              </Link>
            </div>
            {reimbursements.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No settled reimbursements to display.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {reimbursements.slice(0, 5).map((r) => (
                  <div key={r.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-medium">{r.title}</p>
                      <p className="text-gray-500 text-xs truncate max-w-[200px] sm:max-w-md">{r.description}</p>
                    </div>
                    <span className="text-emerald-400 font-semibold text-sm whitespace-nowrap">
                      + ₹{Number(r.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 h-fit space-y-6">
          <div>
            <h3 className="text-white font-semibold text-base">Directory Breakdown</h3>
            <p className="text-gray-500 text-xs mt-1">Overview of roles across the organization.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Employees (EMP)
              </span>
              <span className="text-white font-semibold">{emps}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Managers (RM)
              </span>
              <span className="text-white font-semibold">{rms}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Accounts Payable (APE)
              </span>
              <span className="text-white font-semibold">{apes}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Executive (CFO)
              </span>
              <span className="text-white font-semibold">{cfos}</span>
            </div>
          </div>

          <hr className="border-white/10" />

          <Link to="/cfo/employees" className="w-full">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white text-sm font-semibold transition-all">
              <span>View User Directory</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
