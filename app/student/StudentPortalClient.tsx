'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
}

interface Enrollment {
  id: string
  course_id: string
  courses: Course
}

interface StudentPortalClientProps {
  user: any
  initialCourses: Course[]
  initialEnrollments: Enrollment[]
}

export default function StudentPortalClient({ user, initialCourses, initialEnrollments }: StudentPortalClientProps) {
  const [coursesWithMilestones, setCoursesWithMilestones] = useState<any[]>([])
  const [stats, setStats] = useState({
    enrolledCount: initialEnrollments.length,
    completedMilestonesCount: 0,
    totalMilestonesCount: 0,
    overallPercent: 0,
  })

  useEffect(() => {
    // We want to fetch milestones for all courses to calculate progress accurately
    const fetchMilestones = async () => {
      // Let's call supabase directly from client to get courses with milestones
      const { createClient } = await import('@/utils/supabase/client')
      const supabase = createClient()
      
      const { data } = await supabase.from('courses').select('*, milestones(*)')
      if (data) {
        setCoursesWithMilestones(data)
        
        // Calculate stats
        let completedCount = 0
        let totalCount = 0
        
        initialEnrollments.forEach((enrollment) => {
          const courseData = data.find((c) => c.id === enrollment.course_id)
          if (courseData && courseData.milestones) {
            const courseMilestones = courseData.milestones
            totalCount += courseMilestones.length
            
            // Read from local storage
            const localStorageKey = `progress_${user.id}_${enrollment.course_id}`
            const savedProgress = localStorage.getItem(localStorageKey)
            if (savedProgress) {
              try {
                const checkedIds = JSON.parse(savedProgress)
                // Only count valid milestones that actually exist in the course
                const validChecked = checkedIds.filter((id: string) => 
                  courseMilestones.some((m: any) => m.id === id)
                )
                completedCount += validChecked.length
              } catch (e) {
                console.error(e)
              }
            }
          }
        })
        
        const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
        setStats({
          enrolledCount: initialEnrollments.length,
          completedMilestonesCount: completedCount,
          totalMilestonesCount: totalCount,
          overallPercent: percent,
        })
      }
    }
    fetchMilestones()
  }, [initialEnrollments, user.id])

  return (
    <div className="space-y-12">
      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner">
            📚
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.enrolledCount}</h4>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner">
            🎯
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Milestones</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stats.completedMilestonesCount} <span className="text-xs font-normal text-slate-400">/ {stats.totalMilestonesCount}</span>
            </h4>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner">
            📈
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Progress</p>
            <div className="flex items-center gap-3 mt-1">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.overallPercent}%</h4>
              {/* Mini progress bar */}
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.overallPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Active Courses</h3>
        {initialEnrollments.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-900/30 rounded-2xl glass-card border border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't enrolled in any courses yet.</p>
            <Link href="/" className="inline-block mt-4 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Browse Available Courses →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialEnrollments.map((enrollment) => {
              const fullCourse = coursesWithMilestones.find((c) => c.id === enrollment.course_id)
              const milestones = fullCourse?.milestones || []
              
              // Calculate progress locally
              let courseProgress = 0
              let completedIdsCount = 0
              const localStorageKey = `progress_${user.id}_${enrollment.course_id}`
              const savedProgress = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey) : null
              
              if (savedProgress && milestones.length > 0) {
                try {
                  const checkedIds = JSON.parse(savedProgress)
                  const validChecked = checkedIds.filter((id: string) => 
                    milestones.some((m: any) => m.id === id)
                  )
                  completedIdsCount = validChecked.length
                  courseProgress = Math.round((completedIdsCount / milestones.length) * 100)
                } catch (e) {
                  console.error(e)
                }
              }

              return (
                <div key={enrollment.id} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden glass-card border border-slate-100 dark:border-slate-800 hover-lift shadow-sm">
                  {/* Header visual */}
                  <div className="h-32 bg-gradient-to-br from-emerald-400/80 to-teal-500/80 flex items-center justify-center relative">
                    <span className="text-white text-4xl font-extrabold select-none transition-transform duration-300 group-hover:scale-110">
                      {enrollment.courses?.title[0]}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm border border-slate-100/10">
                      {courseProgress}% Complete
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col justify-between h-[210px]">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {enrollment.courses?.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                        {enrollment.courses?.description}
                      </p>
                    </div>

                    {/* Progress details */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${courseProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                        <span>{completedIdsCount} of {milestones.length} milestones</span>
                        <Link 
                          href={`/courses/${enrollment.course_id}`} 
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold"
                        >
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Available Courses Section */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Browse More Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialCourses
            .filter((c) => !initialEnrollments.some((e) => e.course_id === c.id))
            .map((course) => (
              <div key={course.id} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden glass-card border border-slate-100 dark:border-slate-800 hover-lift shadow-sm">
                <div className="h-32 bg-gradient-to-br from-indigo-400/80 to-purple-500/80 flex items-center justify-center relative">
                  <span className="text-white text-4xl font-extrabold select-none transition-transform duration-300 group-hover:scale-110">
                    {course.title[0]}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between h-[200px]">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Not enrolled</span>
                    <Link 
                      href={`/courses/${course.id}`} 
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-all"
                    >
                      View Details & Enroll →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
