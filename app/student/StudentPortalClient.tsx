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
    const fetchMilestones = async () => {
      const { createClient } = await import('@/utils/supabase/client')
      const supabase = createClient()

      const { data } = await supabase.from('courses').select('*, milestones(*)')
      if (data) {
        setCoursesWithMilestones(data)

        let completedCount = 0
        let totalCount = 0

        initialEnrollments.forEach((enrollment) => {
          const courseData = data.find((c) => c.id === enrollment.course_id)
          if (courseData && courseData.milestones) {
            const courseMilestones = courseData.milestones
            totalCount += courseMilestones.length

            const localStorageKey = `progress_${user.id}_${enrollment.course_id}`
            const savedProgress = localStorage.getItem(localStorageKey)
            if (savedProgress) {
              try {
                const checkedIds = JSON.parse(savedProgress)
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

  const getCourseProgress = (courseId: string) => {
    const fullCourse = coursesWithMilestones.find((c) => c.id === courseId)
    const milestones = fullCourse?.milestones || []
    const localStorageKey = `progress_${user.id}_${courseId}`
    const savedProgress = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey) : null
    let completedIdsCount = 0

    if (savedProgress && milestones.length > 0) {
      try {
        const checkedIds = JSON.parse(savedProgress)
        const validChecked = checkedIds.filter((id: string) =>
          milestones.some((m: any) => m.id === id)
        )
        completedIdsCount = validChecked.length
      } catch (e) {
        console.error(e)
      }
    }

    return {
      completed: completedIdsCount,
      total: milestones.length,
      percent: milestones.length > 0 ? Math.round((completedIdsCount / milestones.length) * 100) : 0,
    }
  }

  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500',
  ]

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Enrolled</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.enrolledCount}</p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(stats.enrolledCount * 33, 100)}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/40 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.completedMilestonesCount}
                <span className="text-sm font-normal text-slate-400"> / {stats.totalMilestonesCount}</span>
              </p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${stats.overallPercent}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Progress</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.overallPercent}%</p>
              </div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${stats.overallPercent}%` }} />
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          My Courses
        </h3>
        {initialEnrollments.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-900/30 rounded-2xl glass-card border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No courses enrolled yet</p>
            <Link href="/" className="inline-block mt-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialEnrollments.map((enrollment, idx) => {
              const fullCourse = coursesWithMilestones.find((c) => c.id === enrollment.course_id)
              const milestones = fullCourse?.milestones || []
              const progress = getCourseProgress(enrollment.course_id)

              return (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.course_id}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden glass-card border border-slate-100 dark:border-slate-800 hover-lift shadow-sm animate-fade-in"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className={`h-28 bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center relative`}>
                    <span className="text-white text-4xl font-extrabold select-none transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">
                      {enrollment.courses?.title[0]}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm border border-slate-100/10">
                      {progress.percent}%
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {enrollment.courses?.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {enrollment.courses?.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                        <span>{progress.completed}/{progress.total} milestones</span>
                        <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                          Continue
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {initialCourses.filter((c) => !initialEnrollments.some((e) => e.course_id === c.id)).length > 0 && (
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            Browse More
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialCourses
              .filter((c) => !initialEnrollments.some((e) => e.course_id === c.id))
              .map((course, idx) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden glass-card border border-slate-100 dark:border-slate-800 hover-lift shadow-sm animate-fade-in"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className={`h-28 bg-gradient-to-br ${gradients[(idx + 2) % gradients.length]} flex items-center justify-center`}>
                    <span className="text-white text-4xl font-extrabold select-none transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">
                      {course.title[0]}
                    </span>
                  </div>

                  <div className="p-5">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Not enrolled</span>
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                        View
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
