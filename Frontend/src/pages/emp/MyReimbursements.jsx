import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, Filter } from 'lucide-react'

import { listReimbursements } from '../../services/reimbursement.service'
import StatusBadge from '../../components/common/StatusBadge'
import SearchBox from '../../components/common/SearchBox'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

const PAGE_SIZE = 8

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']

export default function MyReimbursements() {
  const [reimbursements, setReimbursements] = useState([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [statusFilter, setStatusFilter]     = useState('ALL')
  const [page, setPage]                     = useState(1)

  useEffect(() => {
    listReimbursements()
      .then(setReimbursements)
      .catch(() => setReimbursements([]))
      .finally(() => setLoading(false))
  }, [])

  // ── Filter + search ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return reimbursements.filter((r) => {
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
      const matchesSearch =
        search === '' ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [reimbursements, statusFilter, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page when filter changes
  const handleFilterChange = (f) => { setStatusFilter(f); setPage(1) }
  const handleSearch       = (q) => { setSearch(q);       setPage(1) }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">My Reimbursements</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track the status of all your submitted requests.
        </p>
      </motion.div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <SearchBox
          value={search}
          onChange={handleSearch}
          placeholder="Search by title or description..."
          className="flex-1"
        />

        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === f
                  ? 'gradient-primary text-white border-transparent shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-800 text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-200'
              }`}
            >
              <Filter size={12} className="inline mr-1.5" />
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <Loader text="Loading your reimbursements..." />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No reimbursements found"
            description={
              search || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filter.'
                : 'Submit your first reimbursement to get started.'
            }
            icon={FileText}
          />
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Title</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {paginated.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto] gap-2 sm:gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="text-white font-medium text-sm truncate">{r.title}</div>
                  <div className="text-gray-500 text-sm truncate">{r.description}</div>
                  <div className="text-white font-semibold text-sm whitespace-nowrap">
                    ₹{Number(r.amount).toLocaleString('en-IN')}
                  </div>
                  <div><StatusBadge status={r.status} /></div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
