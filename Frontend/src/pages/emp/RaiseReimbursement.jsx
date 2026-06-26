import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FileText, IndianRupee, AlignLeft, Type } from 'lucide-react'
import toast from 'react-hot-toast'

import { createReimbursement } from '../../services/reimbursement.service'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

/**
 * Textarea — reusable styled textarea matching the Input component design.
 */
function Textarea({ label, id, error, icon: Icon, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3.5 text-gray-500 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <textarea
          id={id}
          className={`
            w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-gray-100
            placeholder:text-gray-500 transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export default function RaiseReimbursement() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await createReimbursement({
        title:       data.title,
        description: data.description,
        amount:      parseFloat(data.amount),
      })
      toast.success('Reimbursement request submitted successfully!')
      reset()
      navigate('/emp/reimbursements')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Raise a Request</h1>
        <p className="text-gray-400 text-sm mt-1">
          Submit your expense for reimbursement. Your RM will review it first.
        </p>
      </motion.div>

      {/* ── Form card ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl p-6"
      >
        {/* Approval flow info */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-300 font-medium mb-2">Approval Flow</p>
          <div className="flex items-center gap-2 flex-wrap">
            {['You Submit', 'RM Reviews', 'APE Reviews', 'Approved ✓'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full border border-white/10">
                  {step}
                </span>
                {i < 3 && <span className="text-gray-600 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <Input
            id="reimb-title"
            label="Title"
            type="text"
            icon={Type}
            placeholder="e.g. Team lunch, Travel to client site"
            error={errors.title?.message}
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
              maxLength: { value: 100, message: 'Title must be under 100 characters' },
            })}
          />

          {/* Description */}
          <Textarea
            id="reimb-description"
            label="Description"
            icon={AlignLeft}
            rows={4}
            placeholder="Provide a brief description of the expense..."
            error={errors.description?.message}
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' },
            })}
          />

          {/* Amount */}
          <Input
            id="reimb-amount"
            label="Amount (₹)"
            type="number"
            icon={IndianRupee}
            step="0.01"
            min="1"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 1, message: 'Amount must be greater than 0' },
            })}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/emp/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              id="submit-reimbursement"
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              <FileText size={16} />
              Submit Request
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
