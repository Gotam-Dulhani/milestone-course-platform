'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

interface NavBarProps {
  user?: any
  systemActive?: boolean
  breadcrumb?: string
  extraLinks?: { href: string; label: string }[]
  isAdmin?: boolean
}

export default function NavBar({ user, systemActive, breadcrumb, extraLinks = [], isAdmin = false }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
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

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {/* Cloud status (home page only) */}
            {systemActive !== undefined && (
              <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
                <span className={`w-2.5 h-2.5 rounded-full ${systemActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {systemActive ? 'Cloud Sync Active' : 'Disconnected'}
                </span>
              </div>
            )}

            {/* Extra links */}
            <div className="hidden sm:flex items-center gap-3">
              {extraLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth buttons */}
            {user ? (
              <>
                {/* Show only role-specific link */}
                {!isAdmin && (
                  <Link
                    href="/student"
                    className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Student
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
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
                <Link
                  href="/auth/signin"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="glowing-gradient text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
