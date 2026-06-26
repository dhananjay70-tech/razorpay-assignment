import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail } from 'lucide-react'

import { listEmployees } from '../../services/employee.service'
import SearchBox from '../../components/common/SearchBox'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'

const PAGE_SIZE = 8

export default function MyEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)

  useEffect(() => {
    listEmployees()
      .then(setEmployees)
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => employees.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
    ),
    [employees, search]
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (q) => { setSearch(q); setPage(1) }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">My Employees</h1>
        <p className="text-gray-400 text-sm mt-1">
          Employees assigned to you ({employees.length} total)
        </p>
      </motion.div>

      <SearchBox
        value={search}
        onChange={handleSearch}
        placeholder="Search by name or email..."
        className="max-w-md"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <Loader text="Loading employees..." />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No employees found"
            description={search ? 'Try a different search.' : 'No employees are assigned to you yet.'}
            icon={Users}
          />
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
            </div>

            <div className="divide-y divide-white/5">
              {paginated.map((emp, i) => (
                <motion.div
                  key={emp.userId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto] gap-2 sm:gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  {/* Name + avatar */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {emp.name[0].toUpperCase()}
                    </div>
                    <span className="text-white font-medium text-sm">{emp.name}</span>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail size={13} className="text-gray-600" />
                    {emp.email}
                  </div>
                  {/* Role */}
                  <StatusBadge status={emp.role} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
