'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import ThemeToggle from '@/app/components/ThemeToggle'

export default function CourseDetail() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [course, setCourse] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [enrolled, setEnrolled] = useState(false)
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: courseData } = await supabase
        .from('courses')
        .select('*, milestones(*)')
        .eq('id', id)
        .single()
      setCourse(courseData)

      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .single()
        setEnrolled(!!enrollment)

        // Read checked milestones from local storage
        const saved = localStorage.getItem(`progress_${user.id}_${id}`)
        if (saved) {
          try {
            setCheckedMilestones(JSON.parse(saved))
          } catch (e) {
            console.error(e)
          }
        }
      }
    }
    fetchData()
  }, [id, supabase])

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    await supabase.from('enrollments').insert({ user_id: user.id, course_id: id })
    setEnrolled(true)
  }

  const handleToggleMilestone = (milestoneId: string) => {
    if (!user || !enrolled) return

    let updated = [...checkedMilestones]
    if (updated.includes(milestoneId)) {
      updated = updated.filter(item => item !== milestoneId)
    } else {
      updated.push(milestoneId)
    }

    setCheckedMilestones(updated)
    localStorage.setItem(`progress_${user.id}_${id}`, JSON.stringify(updated))
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-semibold animate-pulse">Loading course detail...</p>
        </div>
      </div>
    )
  }

  const milestones = course.milestones || []
  // Filter checkedMilestones to only count active ones that are part of this course
  const activeChecked = checkedMilestones.filter((mId) => milestones.some((m: any) => m.id === mId))
  const completedCount = activeChecked.length
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0
  const isCourseComplete = progressPercent === 100 && milestones.length > 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 glowing-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                  C
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Course<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
                </span>
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {course.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link href="/student" className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                Student Portal
              </Link>
              <ThemeToggle />
              {user && (
                <form action="/auth/signout" method="post">
                  <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                    Sign Out
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden glass-card border border-slate-100 dark:border-slate-800 shadow-md">
          {/* Cover Visual */}
          <div className="h-60 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/10" />
            <span className="text-white text-7xl font-black transform scale-110 drop-shadow-md select-none">
              {course.title[0]}
            </span>
          </div>

          {/* Details & Actions */}
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{course.title}</h2>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">{course.description}</p>
            </div>

            {/* Enroll / Progress Section */}
            {!enrolled ? (
              <button
                onClick={handleEnroll}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.99]"
              >
                Enroll Now
              </button>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-950/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active Student
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {progressPercent}% Complete
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{completedCount} of {milestones.length} milestones complete</span>
                  <span>Keep it up!</span>
                </div>
              </div>
            )}

            {/* Course Completion Banner */}
            {isCourseComplete && (
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 animate-bounce">
                <div>
                  <h4 className="text-xl font-extrabold">🎉 Congratulations!</h4>
                  <p className="text-sm text-emerald-50/90 mt-1">You have fully completed all course milestones!</p>
                </div>
                <Link 
                  href="/student"
                  className="bg-white text-emerald-700 font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-md text-sm shrink-0"
                >
                  View Portal
                </Link>
              </div>
            )}

            {/* Milestones Checklist */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Course Milestones</h3>
              {milestones.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">No milestones have been configured for this course yet.</p>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone: any, index: number) => {
                    const isChecked = checkedMilestones.includes(milestone.id)
                    return (
                      <div 
                        key={milestone.id} 
                        onClick={() => enrolled && handleToggleMilestone(milestone.id)}
                        className={`p-6 border rounded-2xl transition-all duration-200 ${
                          enrolled 
                            ? 'cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/50' 
                            : ''
                        } ${
                          isChecked 
                            ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/10 dark:bg-emerald-950/5' 
                            : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Left checkbox / indicator */}
                          {enrolled ? (
                            <div className="flex-shrink-0 pt-0.5">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                isChecked 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400'
                              }`}>
                                {isChecked && (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                          )}

                          {/* Right Content */}
                          <div className="flex-1">
                            <h4 className={`text-lg font-bold transition-all ${
                              isChecked ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-900 dark:text-white'
                            }`}>
                              {milestone.title}
                            </h4>
                            <p className={`text-sm mt-2 leading-relaxed ${
                              isChecked ? 'text-emerald-600/70 dark:text-emerald-500/60' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
