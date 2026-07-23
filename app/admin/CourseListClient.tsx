'use client'

import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  milestones?: any[]
}

interface CourseListClientProps {
  courses: Course[]
}

export default function CourseListClient({ courses }: CourseListClientProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
        <span className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
        Active Courses
      </h3>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No courses yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create your first course using the form.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 glass-card border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {course.title[0]?.toUpperCase()}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">{course.title}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 ml-12">
                    {course.description}
                  </p>

                  {course.milestones && course.milestones.length > 0 && (
                    <div className="mt-4 ml-12 flex flex-wrap gap-2">
                      {course.milestones.slice(0, 4).map((milestone: any, index: number) => (
                        <span
                          key={milestone.id}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg"
                        >
                          <span className="w-4 h-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded flex items-center justify-center text-[9px] font-bold">
                            {index + 1}
                          </span>
                          {milestone.title.length > 20 ? milestone.title.substring(0, 20) + '...' : milestone.title}
                        </span>
                      ))}
                      {course.milestones.length > 4 && (
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-2 py-1">
                          +{course.milestones.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className="flex-1 sm:flex-none text-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 sm:flex-none text-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </Link>
                  <form
                    action={`/admin/courses/${course.id}/delete`}
                    method="post"
                    className="flex-1 sm:flex-none"
                    onSubmit={(e) => {
                      if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) {
                        e.preventDefault()
                      }
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full text-center bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
