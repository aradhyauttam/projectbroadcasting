import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/ui/Spinner'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const DEMO_ACCOUNTS = [
  {
    role: 'Teacher',
    email: 'teacher@demo.com',
    password: 'password123',
    icon: '👩‍🏫',
  },
  {
    role: 'Principal',
    email: 'principal@demo.com',
    password: 'password123',
    icon: '🏫',
  },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`)

      if (result.user.role === 'teacher') {
        navigate('/teacher/dashboard')
      } else {
        navigate('/principal/dashboard')
      }
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  const fillDemo = (account) => {
    setValue('email', account.email)
    setValue('password', account.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-surface-950 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500 opacity-10 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-30 bg-brand-500 rounded-2xl shadow-brand mb-4">
            <span className="font-display font-black text-white text-xl">
              GB
            </span>
          </div>

          <h1 className="font-display font-black text-white text-3xl">
            Grubpac Broadcast
          </h1>

          <p className="text-brand-300 mt-1 text-sm">
            Content Broadcasting System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-modal p-8">
          <h2 className="font-display font-bold text-surface-900 text-xl mb-6">
            Sign in to continue
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="label mb-3">
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@school.edu"
                className={`input ${
                  errors.email ? 'input-error' : ''
                }`}
                {...register('email')}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`input pr-11 ${
                    errors.password ? 'input-error' : ''
                  }`}
                  {...register('password')}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-600 transition-colors text-sm"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-2 py-3"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-surface-100">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest text-center mb-3">
              Demo Accounts
            </p>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-surface-200 bg-surface-50 hover:bg-surface-100 hover:border-brand-200 transition-all text-left group"
                >
                  <span className="text-xl">{account.icon}</span>

                  <div>
                    <p className="text-xs font-bold text-surface-700 group-hover:text-brand-600">
                      {account.role}
                    </p>

                    <p className="text-xs text-surface-400 truncate">
                      {account.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-surface-300 mt-3">
              Click to fill credentials, then sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}