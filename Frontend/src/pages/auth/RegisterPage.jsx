import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { register as registerService } from '../../services/auth.service'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [loading, setLoading]             = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await registerService({ name: data.name, email: data.email, password: data.password })
      toast.success('Account created! Please sign in.')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-400 text-sm">
          Use your <span className="text-indigo-400 font-medium">@org.com</span> email to get started.
        </p>
      </motion.div>

      {/* Info box */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 mb-6 flex items-start gap-2">
        <CheckCircle size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          New accounts start with the <span className="text-indigo-400 font-medium">EMP</span> role.
          A CFO can promote you to RM, APE, or CFO.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="register-name"
          label="Full name"
          type="text"
          icon={User}
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <Input
          id="register-email"
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="you@org.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@org\.com$/,
              message: 'Must be an @org.com email address',
            },
          })}
        />

        <Input
          id="register-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder="Min 6 characters"
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <Input
          id="register-confirm"
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          icon={Lock}
          placeholder="Re-enter password"
          error={errors.confirmPassword?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          })}
        />

        <Button
          id="register-submit"
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-2"
        >
          Create account
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
