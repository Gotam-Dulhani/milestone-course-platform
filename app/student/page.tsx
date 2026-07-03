import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import StudentPortalClient from './StudentPortalClient'
import NavBar from '../components/NavBar'

export default async function StudentPortal() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  const isAdmin = roleData?.role === 'admin'

  const { data: courses } = await supabase.from('courses').select('*')
  const { data: enrollments } = await supabase.from('enrollments').select('*, courses(*)').eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <NavBar user={user} breadcrumb="Student Portal" isAdmin={isAdmin} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-gradient font-black">{user.email?.split('@')[0]}</span>!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Track your milestone completions, resume your classes, or enroll in new courses.
          </p>
        </header>

        <StudentPortalClient 
          user={user} 
          initialCourses={courses || []} 
          initialEnrollments={enrollments || []} 
        />
      </main>
    </div>
  )
}
