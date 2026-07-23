import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CourseDashboard from './components/CourseDashboard'
import NavBar from './components/NavBar'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const isAdmin = roleData?.role === 'admin'

    if (isAdmin) {
      redirect('/admin')
    } else {
      redirect('/student')
    }
  }

  let courses: any[] = []
  let systemActive = false

  try {
    const { data: courseData } = await supabase.from('courses').select('*')
    courses = courseData || []
    systemActive = true
  } catch (err) {
    console.error('Error loading homepage data:', err)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <NavBar user={user} systemActive={systemActive} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/30">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Structured Learning Paths
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Learn with
            <br />
            <span className="text-gradient">Milestone-Based Courses</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Master new skills by completing structured learning phases and tracking your progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/auth/signup"
              className="glowing-gradient text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        <CourseDashboard
          initialCourses={courses}
          user={user}
          enrollments={[]}
        />
      </main>
    </div>
  )
}
