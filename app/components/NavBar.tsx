'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

interface NavBarProps {
  user?: any
  systemActive?: boolean
  breadcrumb?: string
  extraLinks?: { href: string; label: string }[]
  isAdmin?: boolean
}

export default function NavBar({ user, systemActive, breadcrumb, extraLinks = [], isAdmin = false }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navLinkClass = (path: string) =>
    `text-sm font-semibold transition-colors ${
      isActive(path)
        ? 'text-indigo-600 dark:text-indigo-400'
        : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo + Breadcrumb */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 glowing-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                  C
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Course<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
                </span>
              </Link>
              {breadcrumb && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{breadcrumb}</span>
                </>
              )}
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              {/* System Status */}
              {systemActive !== undefined && (
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
                  <span className={`w-2.5 h-2.5 rounded-full ${systemActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {systemActive ? 'Cloud Sync Active' : 'Disconnected'}
                  </span>
                </div>
              )}

              {/* Extra Links */}
              {extraLinks.map((l) => (
                <Link key={l.href} href={l.href} className={navLinkClass(l.href)}>
                  {l.label}
                </Link>
              ))}

              <ThemeToggle />

              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
                    <div className="w-6 h-6 rounded-full glowing-gradient flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 max-w-[120px] truncate">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>

                  {!isAdmin && (
                    <Link href="/student" className={navLinkClass('/student')}>
                      Student
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Admin
                    </Link>
                  )}
                  <form action="/auth/signout" method="post">
                    <button className="bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200">
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className={navLinkClass('/auth/signin')}>
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="glowing-gradient text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 right-0 left-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-3 px-3 py-2.5 mb-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <div className="w-8 h-8 rounded-full glowing-gradient flex items-center justify-center text-white text-sm font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{user.email?.split('@')[0]}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{user.email}</div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              {user ? (
                <>
                  {!isAdmin && (
                    <Link
                      href="/student"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive('/student')
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Student Portal
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive('/admin')
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                          : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-slate-100 dark:border-slate-800 my-2" />
                  <form action="/auth/signout" method="post">
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 glowing-gradient text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all mt-2"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
