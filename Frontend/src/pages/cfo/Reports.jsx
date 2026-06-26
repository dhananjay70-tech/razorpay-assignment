import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileSpreadsheet } from 'lucide-react'

import { listEmployees } from '../../services/employee.service'
import { listReimbursements } from '../../services/reimbursement.service'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import SearchBox from '../../components/common/SearchBox'
import Pagination from '../../components/common/Pagination'

const PAGE_SIZE = 10

export default function Reports() {
  const [employees, setEmployees] = useState([])
  const [reimbursements, setReimbursements] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    Promise.all([listEmployees(), listReimbursements()])
      .then(([empData, reimbData]) => {
        setEmployees(empData || [])
        setReimbursements(reimbData || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const detailedReimbursements = useMemo(() => {
    return reimbursements.map(r => {
      return {
        ...r,
        amountNum: Number(r.amount) || 0
      }
    })
  }, [reimbursements])

  const filtered = useMemo(() => {
    return detailedReimbursements.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [detailedReimbursements, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = useMemo(() => {
    const total = filtered.reduce((sum, r) => sum + r.amountNum, 0)
    const count = filtered.length
    const avg = count > 0 ? total / count : 0
    const max = count > 0 ? Math.max(...filtered.map(r => r.amountNum)) : 0

    return { total, count, avg, max }
  }, [filtered])

  if (loading) return <Loader text="Analyzing payout reports..." />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-outfit">Payout Reports & Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">
          Review aggregates, average claim size, and detailed audits of all settled payout transfers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-white/10 p-5 rounded-2xl">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Total Disbursed</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white">₹{stats.total.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-emerald-500 text-[10px] font-semibold mt-1 block">100% processed by AP</span>
        </div>

        <div className="bg-gray-900 border border-white/10 p-5 rounded-2xl">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Settled Requests</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white">{stats.count}</span>
          </div>
          <span className="text-gray-400 text-[10px] block mt-1">Cleared from approval queues</span>
        </div>

        <div className="bg-gray-900 border border-white/10 p-5 rounded-2xl">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Average Transfer</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white">₹{Math.round(stats.avg).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-gray-400 text-[10px] block mt-1">Per approved reimbursement</span>
        </div>

        <div className="bg-gray-900 border border-white/10 p-5 rounded-2xl">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Peak Transfer</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white">₹{stats.max.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-violet-400 text-[10px] font-semibold block mt-1">Single highest claim value</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBox
          value={search}
          onChange={(q) => { setSearch(q); setPage(1) }}
          placeholder="Filter report by claim details..."
          className="max-w-md w-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {paginated.length === 0 ? (
          <EmptyState
            title="No report matches"
            description="Adjust your search criteria to filter the payouts."
            icon={FileSpreadsheet}
          />
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[2fr_3fr_1fr] gap-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Claim Title</span>
              <span>Description</span>
              <span>Amount</span>
            </div>

            <div className="divide-y divide-white/5">
              {paginated.map((r, i) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:grid sm:grid-cols-[2fr_3fr_1fr] gap-2 sm:gap-4 items-start sm:items-center px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-white font-medium text-sm">{r.title}</p>
                    <span className="inline-block px-1.5 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded">
                      SETTLED
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{r.description}</p>
                  <span className="text-white font-bold text-sm whitespace-nowrap self-end sm:self-auto">
                    ₹{r.amountNum.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
