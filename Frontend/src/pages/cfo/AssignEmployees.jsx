import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, ArrowRight, UserPlus, UserMinus } from 'lucide-react'
import toast from 'react-hot-toast'

import { listEmployees, assignEmployee, removeAssignment } from '../../services/employee.service'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

export default function AssignEmployees() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [selectedEmp, setSelectedEmp] = useState('')
  const [selectedRm, setSelectedRm] = useState('')

  const [removeEmp, setRemoveEmp] = useState('')
  const [removeRm, setRemoveRm] = useState('')

  const fetchUsers = () => {
    setLoading(true)
    listEmployees()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }

  useEffect(fetchUsers, [])

  const employees = users.filter(u => u.role === 'EMP')
  const managers = users.filter(u => u.role === 'RM')

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!selectedEmp || !selectedRm) {
      toast.error('Please select both an employee and a manager')
      return
    }

    setSubmitting(true)
    try {
      await assignEmployee({
        employeeId: selectedEmp,
        managerId: selectedRm,
      })
      toast.success('Reporting hierarchy mapped successfully!')
      setSelectedEmp('')
      setSelectedRm('')
    } catch (err) {
      toast.error(err.message || 'Failed to assign reporting manager')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (e) => {
    e.preventDefault()
    if (!removeEmp || !removeRm) {
      toast.error('Please select both an employee and their manager')
      return
    }

    setSubmitting(true)
    try {
      await removeAssignment({
        employeeId: removeEmp,
        managerId: removeRm,
      })
      toast.success('Reporting assignment cleared successfully!')
      setRemoveEmp('')
      setRemoveRm('')
    } catch (err) {
      toast.error(err.message || 'Failed to remove assignment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader text="Loading directory list..." />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-outfit">Reporting Hierarchy</h1>
        <p className="text-gray-400 text-sm mt-1">
          Establish 1-to-1 relationships between Employees and Reporting Managers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Assign/Update Manager</h2>
              <p className="text-gray-500 text-xs mt-0.5">Link an employee to their reporting manager.</p>
            </div>
          </div>

          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Select Employee (EMP)
              </label>
              <select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.userId} value={emp.userId}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center text-gray-500">
              <ArrowRight size={20} className="rotate-90 lg:rotate-0" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Assign Manager (RM)
              </label>
              <select
                value={selectedRm}
                onChange={(e) => setSelectedRm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
              >
                <option value="">-- Choose Reporting Manager --</option>
                {managers.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="w-full mt-4"
            >
              Establish Reporting Line
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
              <UserMinus size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Clear Reporting Assignment</h2>
              <p className="text-gray-500 text-xs mt-0.5">Remove reporting manager mapping for an employee.</p>
            </div>
          </div>

          <form onSubmit={handleRemove} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Select Employee (EMP)
              </label>
              <select
                value={removeEmp}
                onChange={(e) => setRemoveEmp(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.userId} value={emp.userId}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center text-gray-500">
              <ArrowRight size={20} className="rotate-90 lg:rotate-0" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Manager to Remove (RM)
              </label>
              <select
                value={removeRm}
                onChange={(e) => setRemoveRm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50"
              >
                <option value="">-- Choose Reporting Manager --</option>
                {managers.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="danger"
              loading={submitting}
              className="w-full mt-4"
            >
              Clear Assignment
            </Button>
          </form>
        </motion.div>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 flex gap-4 items-start">
        <HelpCircle className="text-violet-400 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-white font-semibold text-sm">Mapping Constraints Info</h3>
          <p className="text-gray-400 text-xs leading-relaxed mt-1">
            An Employee can report to exactly one manager. Assigning a new manager overrides the current one.
            Only users with the role of <b>EMP</b> can be assigned to report to users with the role of <b>RM</b>.
          </p>
        </div>
      </div>
    </div>
  )
}
