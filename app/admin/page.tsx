import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CourseForm from './CourseForm'
import CourseListClient from './CourseListClient'
import NavBar from '../components/NavBar'

export default async function AdminPanel() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user is admin
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  const isAdmin = roleData?.role === 'admin'
  
  if (!isAdmin) {
    redirect('/') // Redirect non-admins to home
  }

  // Fetch courses, milestones, and enrollments
  const { data: courses } = await supabase.from('courses').select('*, milestones(*)')
  const { data: enrollments } = await supabase.from('enrollments').select('*, courses(*)')

  // Calculate admin panel stats
  const totalCourses = courses?.length || 0
  const totalMilestones = courses?.reduce((acc, course) => acc + (course.milestones?.length || 0), 0) || 0
  const totalEnrollments = enrollments?.length || 0
  
  // Calculate unique students without Set for TypeScript compatibility
  const uniqueUserIds: string[] = []
  enrollments?.forEach(e => {
    if (!uniqueUserIds.includes(e.user_id)) {
      uniqueUserIds.push(e.user_id)
    }
  })
  const uniqueStudents = uniqueUserIds.length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <NavBar user={user} breadcrumb="Admin Control" isAdmin={isAdmin} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fade-in">
        {/* Admin Dashboard Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Manage your structured courses, learning paths, and milestones.</p>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-xl">
              📚
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Courses</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCourses}</h4>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Milestones</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalMilestones}</h4>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Students</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{uniqueStudents}</h4>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center text-xl">
              📝
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrollments</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalEnrollments}</h4>
            </div>
          </div>
        </div>

        {/* Course Form & Course List Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Create Form */}
          <div className="lg:col-span-5">
            <CourseForm />
          </div>

          {/* Manage list */}
          <div className="lg:col-span-7">
            <CourseListClient courses={courses || []} />
          </div>
        </div>

        {/* Enrollment Tracking Section */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            Student Enrollment Records
          </h3>
          
          {enrollments && enrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                          {enrollment.user_id.substring(0, 12)}...
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {enrollment.courses?.title || 'Unknown Course'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p className="text-lg">No enrollments yet!</p>
              <p className="text-sm mt-2">Students will appear here once they enroll in courses.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
