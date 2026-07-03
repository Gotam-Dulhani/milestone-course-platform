import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CourseForm from '../../../CourseForm'
import NavBar from '@/app/components/NavBar'

export default async function EditCourse({ params }: { params: { id: string } }) {
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

  const { data: course } = await supabase
    .from('courses')
    .select('*, milestones(*)')
    .eq('id', params.id)
    .single()

  if (!course) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <NavBar user={user} breadcrumb="Edit Course" isAdmin={isAdmin} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fade-in">
        <CourseForm course={course} />
      </main>
    </div>
  )
}
