import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, Check, X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

import { listEmployees } from '../../services/employee.service'
import { listByUser, updateReimbursementStatus } from '../../services/reimbursement.service'
import SearchBox from '../../components/common/SearchBox'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import Modal from '../../components/common/Modal'

const PAGE_SIZE = 8

export default function AllEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  const [selectedEmp, setSelectedEmp] = useState(null)
  const [empClaims, setEmpClaims] = useState([])
  const [loadingClaims, setLoadingClaims] = useState(false)

  const [actionModal, setActionModal] = useState(null)
  const [acting, setActing] = useState(false)

  const fetchEmployees = () => {
    setLoading(true)
    listEmployees()
      .then(setEmployees)
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false))
  }

  useEffect(fetchEmployees, [])

  const filtered = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === 'ALL' || emp.role === roleFilter
      return matchSearch && matchRole
    })
  }, [employees, search, roleFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleViewClaims = async (emp) => {
    setSelectedEmp(emp)
    setLoadingClaims(true)
    setEmpClaims([])
    try {
      const claims = await listByUser(emp.userId)
      setEmpClaims(claims || [])
    } catch (err) {
      toast.error(err.message || 'Could not fetch claims')
    } finally {
      setLoadingClaims(false)
    }
  }

  const handleAction = async () => {
    if (!actionModal) return
    setActing(true)
    try {
      await updateReimbursementStatus({
        reimbursementId: actionModal.claimId,
        status: actionModal.action,
      })
      toast.success(`Claim successfully ${actionModal.action === 'APPROVED' ? 'approved' : 'rejected'}!`)
      setActionModal(null)
      if (selectedEmp) {
        const claims = await listByUser(selectedEmp.userId)
        setEmpClaims(claims || [])
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    } finally {
      setActing(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-outfit">User Directory</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor all users, roles, and review individual reimbursement histories.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBox
          value={search}
          onChange={(q) => { setSearch(q); setPage(1) }}
          placeholder="Search name or email..."
          className="max-w-md w-full"
        />
        <div className="flex gap-2 self-start md:self-auto overflow-x-auto pb-1 max-w-full">
          {['ALL', 'EMP', 'RM', 'APE', 'CFO'].map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                roleFilter === role
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'bg-gray-900 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <Loader text="Loading directory..." />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Adjust your search or filters to see more results."
            icon={Users}
          />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="w-8"></span>
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-white/5">
              {paginated.map((emp) => (
                <div
                  key={emp.userId}
                  className="flex flex-col md:grid md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-3 md:gap-4 items-start md:items-center px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 text-sm font-semibold uppercase">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{emp.name}</p>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{emp.email}</p>
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
                  <div>
                    {emp.role === 'EMP' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewClaims(emp)}
                      >
                        <Eye size={13} /> View Claims
                      </Button>
                    ) : (
                      <span className="text-gray-600 text-xs italic">No Claims</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        isOpen={!!selectedEmp}
        onClose={() => setSelectedEmp(null)}
        title={`Reimbursements: ${selectedEmp?.name || ''}`}
        size="md"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {loadingClaims ? (
            <Loader text="Loading reimbursement history..." />
          ) : empClaims.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-600 mb-2" size={32} />
              <p className="text-gray-400 text-sm">No reimbursements submitted by this employee yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {empClaims.map((claim) => (
                <div key={claim.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-semibold">{claim.title}</span>
                      <StatusBadge status={claim.status} size="xs" />
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{claim.description}</p>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="text-white font-bold text-sm">
                      ₹{Number(claim.amount).toLocaleString('en-IN')}
                    </span>
                    {claim.status === 'PENDING' && (
                      <div className="flex gap-1.5">
                        <Button
                          variant="success"
                          size="xs"
                          onClick={() => setActionModal({ claimId: claim.id, action: 'APPROVED', title: claim.title })}
                        >
                          <Check size={11} /> Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => setActionModal({ claimId: claim.id, action: 'REJECTED', title: claim.title })}
                        >
                          <X size={11} /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal?.action === 'APPROVED' ? 'Executive Approval' : 'Executive Rejection'}
        size="sm"
      >
        <p className="text-gray-300 text-sm mb-6">
          Are you sure you want to{' '}
          <span className={actionModal?.action === 'APPROVED' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
            {actionModal?.action === 'APPROVED' ? 'approve' : 'reject'}
          </span>{' '}
          this request directly? As CFO, this will bypass all approval stages.
          <br /><br />
          Claim: <span className="text-white font-medium">"{actionModal?.title}"</span>
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
