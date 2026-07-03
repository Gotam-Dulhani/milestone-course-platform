import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CourseDashboard from './components/CourseDashboard'
import NavBar from './components/NavBar'

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

  // For non-logged-in users, show the home page
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
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <NavBar user={user} systemActive={systemActive} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/30">
            ✨ Next-Gen Learning Experience
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Learn with structured <br />
            <span className="text-gradient">Milestone-Based Courses</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Gain mastery in fields by completing bite-sized learning phases, tracking your progress dynamically.
          </p>
        </div>

        {/* Dashboard Component */}
        <CourseDashboard 
          initialCourses={courses} 
          user={user} 
          enrollments={[]} 
        />
      </main>
    </div>
  )
}
