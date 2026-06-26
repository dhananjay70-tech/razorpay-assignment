import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { listReimbursements, updateReimbursementStatus } from '../../services/reimbursement.service'
import StatusBadge from '../../components/common/StatusBadge'
import SearchBox from '../../components/common/SearchBox'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Modal from '../../components/common/Modal'

const PAGE_SIZE = 8

export default function PendingReimbursements() {
  const [reimbursements, setReimbursements] = useState([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState('')
  const [page, setPage]                     = useState(1)
  const [actionModal, setActionModal]       = useState(null) // { id, action: 'APPROVED'|'REJECTED', title }
  const [acting, setActing]                 = useState(false)

  const fetchData = () => {
    setLoading(true)
    listReimbursements()
      .then(setReimbursements)
      .catch(() => setReimbursements([]))
      .finally(() => setLoading(false))
  }

  useEffect(fetchData, [])

  const filtered = useMemo(
    () => reimbursements.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
    ),
    [reimbursements, search]
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleAction = async () => {
    if (!actionModal) return
    setActing(true)
    try {
      await updateReimbursementStatus({
        reimbursementId: actionModal.id,
        status:          actionModal.action,
      })
      toast.success(
        actionModal.action === 'APPROVED'
          ? 'Request approved successfully!'
          : 'Request rejected.'
      )
      setActionModal(null)
      fetchData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActing(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Pending Approvals</h1>
        <p className="text-gray-400 text-sm mt-1">
          Review and approve or reject reimbursement requests from your team.
        </p>
      </motion.div>

      <SearchBox
        value={search}
        onChange={(q) => { setSearch(q); setPage(1) }}
        placeholder="Search requests..."
        className="max-w-md"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <Loader text="Loading requests..." />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No pending requests"
            description={search ? 'Try a different search.' : 'All caught up! Nothing to review.'}
            icon={CheckSquare}
          />
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Title</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-white/5">
              {paginated.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto] gap-3 sm:gap-4 items-start sm:items-center px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium text-sm">{r.title}</p>
                    <StatusBadge status={r.status} size="xs" />
                  </div>
                  <p className="text-gray-500 text-sm truncate">{r.description}</p>
                  <span className="text-white font-semibold text-sm whitespace-nowrap">
                    ₹{Number(r.amount).toLocaleString('en-IN')}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setActionModal({ id: r.id, action: 'APPROVED', title: r.title })}
                    >
                      <Check size={13} /> Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setActionModal({ id: r.id, action: 'REJECTED', title: r.title })}
                    >
                      <X size={13} /> Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* ── Confirm Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal?.action === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
        size="sm"
      >
        <p className="text-gray-300 text-sm mb-6">
          Are you sure you want to{' '}
          <span className={actionModal?.action === 'APPROVED' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
            {actionModal?.action?.toLowerCase()}
          </span>{' '}
          the request: <span className="text-white font-medium">"{actionModal?.title}"</span>?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setActionModal(null)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant={actionModal?.action === 'APPROVED' ? 'success' : 'danger'}
            loading={acting}
            onClick={handleAction}
            className="flex-1"
          >
            {actionModal?.action === 'APPROVED' ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
