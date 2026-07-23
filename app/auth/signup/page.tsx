'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { getPasswordStrength, hasUpperCase, hasNumber } from '@/utils/password'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const passwordChecks = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Contains uppercase letter', met: hasUpperCase(password) },
    { label: 'Contains a number', met: hasNumber(password) },
    { label: 'Passwords match', met: password.length > 0 && password === confirmPassword },
  ]

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      })

      if (error) {
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          setError('Unable to connect to authentication service. Please check your internet connection and try again.')
        } else {
          setError(error.message)
        }
      } else if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists.')
      } else {
        await supabase.auth.signOut()
        setSuccess(true)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      if (err instanceof TypeError && err.message?.includes('Failed to fetch')) {
        setError('Unable to connect to authentication service. Please verify your Supabase configuration and try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const gridStyle = {
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '60px 60px'
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors duration-300">

      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden auth-panel-bg items-center justify-center">
        <div className="absolute top-16 left-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-[90px] animate-float" />
        <div className="absolute bottom-24 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px] animate-float-delayed" />
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-pink-500/15 rounded-full blur-[60px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-[50px] animate-float-delayed" />

        <div className="absolute inset-0 opacity-[0.03]" style={gridStyle} />

        <div className={`relative z-10 max-w-xl px-14 ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 glowing-gradient rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
              C
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Course<span className="text-indigo-400">Flow</span>
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
            Start your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              learning adventure
            </span>
          </h1>
          <p className="text-lg text-indigo-200/70 leading-relaxed mb-12">
            Join thousands of learners mastering new skills through structured, milestone-based courses.
          </p>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />
            <div className="space-y-8">
              {[
                { step: '01', title: 'Choose a course', desc: 'Browse our curated catalog of courses' },
                { step: '02', title: 'Complete milestones', desc: 'Progress through bite-sized learning phases' },
                { step: '03', title: 'Track and master', desc: 'Watch your progress and achieve mastery' },
              ].map((item, i) => (
                <div key={i} className={`flex items-start gap-5 relative ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`} style={{ animationDelay: `${0.3 + i * 0.2}s` }}>
                  <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-indigo-200/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'].map((bg, i) => (
                <div key={i} className={`w-9 h-9 rounded-full ${bg} border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full bg-white/10 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                +
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white">10,000+ learners</div>
              <div className="text-xs text-indigo-300/60">already building their future</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12 relative">
        <div className="lg:hidden absolute top-6 left-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 glowing-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
              C
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Course<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </Link>
        </div>

        <div className={`w-full max-w-[420px] ${mounted ? 'animate-slide-in-right' : 'opacity-0'}`}>
          {success ? (
            <div className="text-center animate-slide-up">
              <div className="relative inline-flex mb-8">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-scale-check">
                  <svg className="w-12 h-12 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute inset-0 w-24 h-24 rounded-full bg-emerald-400/20 animate-pulse-ring" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                Account created!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-sm mx-auto">
                Your account has been successfully created. Please sign in to start your learning journey.
              </p>
              <Link
                href="/auth/signin"
                className="w-full inline-flex items-center justify-center gap-2 glowing-gradient text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
              >
                Continue to Sign In
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/40 mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Get started free
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Create your account
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl px-4 py-3 animate-slide-up">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="stagger-1 animate-fade-up-stagger">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700/80 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 outline-none transition-all input-glow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="stagger-2 animate-fade-up-stagger">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Create a strong password"
                      className="w-full pl-11 pr-12 py-3 border border-slate-200 dark:border-slate-700/80 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 outline-none transition-all input-glow"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="mt-3 animate-slide-up">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-bold ml-3 ${
                          strength.score <= 1 ? 'text-red-500' :
                          strength.score <= 2 ? 'text-orange-500' :
                          strength.score <= 3 ? 'text-yellow-500' :
                          'text-emerald-500'
                        }`}>
                          {strength.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                        {passwordChecks.map((check, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                              check.met ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'
                            }`}>
                              {check.met && (
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs font-medium transition-colors ${
                              check.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="stagger-3 animate-fade-up-stagger">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter your password"
                      className={`w-full pl-11 pr-12 py-3 border rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 outline-none transition-all input-glow ${
                        confirmPassword.length > 0
                          ? password === confirmPassword
                            ? 'border-emerald-300 dark:border-emerald-700'
                            : 'border-red-300 dark:border-red-700'
                          : 'border-slate-200 dark:border-slate-700/80'
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {confirmPassword.length > 0 && (
                        <span className={`mr-1 ${password === confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
                          {password === confirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="stagger-4 animate-fade-up-stagger pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group glowing-gradient text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className={`inline-flex items-center gap-2 transition-all duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                      Create Account
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    {loading && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating account...
                      </span>
                    )}
                    <span className="absolute inset-0 animate-shimmer" />
                  </button>
                </div>
              </form>

              <div className="stagger-5 animate-fade-up-stagger mt-6">
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
