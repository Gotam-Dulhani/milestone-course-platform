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
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Active Courses List</h3>
      
      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-2xl glass-card border border-slate-100 dark:border-slate-800/80">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No courses have been created yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 glass-card border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                {/* Course details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{course.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">{course.description}</p>
                  </div>
                  
                  {/* Milestones list */}
                  {course.milestones && course.milestones.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-850/60">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Milestones ({course.milestones.length})</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {course.milestones.map((milestone: any, index: number) => (
                          <div key={milestone.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 truncate">
                            <span className="w-5 h-5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md flex items-center justify-center font-bold text-[10px]">
                              {index + 1}
                            </span>
                            <span className="font-medium truncate">{milestone.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                  <Link 
                    href={`/admin/courses/${course.id}/edit`} 
                    className="flex-1 sm:flex-none text-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 hover:dark:bg-indigo-950/60 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Edit
                  </Link>
                  <Link 
                    href={`/courses/${course.id}`} 
                    className="flex-1 sm:flex-none text-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Preview
                  </Link>
                  <form 
                    action={`/admin/courses/${course.id}/delete`} 
                    method="post"
                    className="flex-1 sm:flex-none"
                    onSubmit={(e) => {
                      if (!confirm(`Are you sure you want to delete "${course.title}"?`)) {
                        e.preventDefault()
                      }
                    }}
                  >
                    <button 
                      type="submit" 
                      className="w-full text-center bg-red-550 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
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
