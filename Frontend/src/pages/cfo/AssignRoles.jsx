import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, User, Check } from 'lucide-react'
import toast from 'react-hot-toast'

import { listEmployees } from '../../services/employee.service'
import { assignRole } from '../../services/role.service'
import SearchBox from '../../components/common/SearchBox'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function AssignRoles() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchEmployees = () => {
    setLoading(true)
    listEmployees()
      .then(setEmployees)
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false))
  }

  useEffect(fetchEmployees, [])

  const filtered = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [employees, search])

  const handleAssignRole = async () => {
    if (!selectedUser || !newRole) return
    if (selectedUser.role === newRole) {
      toast.error('User already has this role')
      return
    }

    setUpdating(true)
    try {
      await assignRole({
        userId: selectedUser.userId,
        role: newRole,
      })
      toast.success(`Role updated successfully to ${newRole}!`)
      setSelectedUser(null)
      setNewRole('')
      fetchEmployees()
    } catch (err) {
      toast.error(err.message || 'Failed to update role')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-outfit">Role Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          Promote or reassign authorization roles for directory members.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search directory to change roles..."
            className="w-full"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto"
          >
            {loading ? (
              <Loader text="Loading directory list..." />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No users found"
                description="Search for a different member name or email."
                icon={User}
              />
            ) : (
              <div className="divide-y divide-white/5">
                {filtered.map((emp) => (
                  <div
                    key={emp.userId}
                    onClick={() => {
                      setSelectedUser(emp)
                      setNewRole(emp.role)
                    }}
                    className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors ${
                      selectedUser?.userId === emp.userId ? 'bg-violet-950/20 border-l-4 border-violet-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 text-xs font-semibold uppercase">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{emp.name}</p>
                        <p className="text-gray-500 text-xs">{emp.email}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        emp.role === 'CFO' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        emp.role === 'APE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        emp.role === 'RM' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {emp.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Role Editor</h2>
          {selectedUser ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-6"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Modifying User</p>
                <h3 className="text-white text-base font-medium mt-1">{selectedUser.name}</h3>
                <p className="text-gray-400 text-xs">{selectedUser.email}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'EMP', title: 'Employee', desc: 'Raise claims' },
                    { id: 'RM', title: 'Manager', desc: '1st level approval' },
                    { id: 'APE', title: 'Accounts Payable', desc: 'Settle payouts' },
                    { id: 'CFO', title: 'CFO Executive', desc: 'Full admin rights' },
                  ].map((roleOption) => (
                    <button
                      key={roleOption.id}
                      onClick={() => setNewRole(roleOption.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        newRole === roleOption.id
                          ? 'bg-violet-600/10 border-violet-500 text-white'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full mb-1">
                        <span className="text-xs font-bold">{roleOption.title}</span>
                        {newRole === roleOption.id && <Check size={12} className="text-violet-400" />}
                      </div>
                      <span className="text-[9px] text-gray-500 font-medium leading-none">
                        {roleOption.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAssignRole}
                  loading={updating}
                  className="w-full"
                  variant="primary"
                >
                  Apply Role Change
                </Button>
                <Button
                  onClick={() => setSelectedUser(null)}
                  className="w-full"
                  variant="secondary"
                >
                  Cancel Selection
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-900 border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="text-gray-600 mb-3" size={32} />
              <p className="text-gray-400 text-sm">Select a user from the directory to edit their role permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
