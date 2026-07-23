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

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const isAdmin = roleData?.role === 'admin'

  if (!isAdmin) {
    redirect('/')
  }

  const { data: courses } = await supabase.from('courses').select('*, milestones(*)')
  const { data: enrollments } = await supabase.from('enrollments').select('*, courses(*)')

  const totalCourses = courses?.length || 0
  const totalMilestones = courses?.reduce((acc, course) => acc + (course.milestones?.length || 0), 0) || 0
  const totalEnrollments = enrollments?.length || 0

  const uniqueUserIds: string[] = []
  enrollments?.forEach(e => {
    if (!uniqueUserIds.includes(e.user_id)) {
      uniqueUserIds.push(e.user_id)
    }
  })
  const uniqueStudents = uniqueUserIds.length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <NavBar user={user} breadcrumb="Admin Control" isAdmin={isAdmin} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fade-in">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                Admin Dashboard
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-5">
                Manage courses, milestones, and student enrollments.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Courses</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCourses}</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(totalCourses * 25, 100)}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/40 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Milestones</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalMilestones}</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(totalMilestones * 10, 100)}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Students</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{uniqueStudents}</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(uniqueStudents * 20, 100)}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/40 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Enrollments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEnrollments}</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.min(totalEnrollments * 20, 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-5">
            <CourseForm />
          </div>
          <div className="lg:col-span-7">
            <CourseListClient courses={courses || []} />
          </div>
        </div>

        <section className="bg-white dark:bg-slate-900 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              Enrollment Records
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {totalEnrollments} total
            </span>
          </div>

          {enrollments && enrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {enrollment.user_id[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                              {enrollment.user_id.substring(0, 8)}...
                            </code>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {enrollment.courses?.title || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No enrollments yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Students will appear here once they enroll in courses.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
