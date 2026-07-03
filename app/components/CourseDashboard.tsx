'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

interface Course {
  id: string
  title: string
  description: string
  milestones?: any[]
}

interface CourseDashboardProps {
  initialCourses: Course[]
  user: any
  enrollments: any[]
}

export default function CourseDashboard({ initialCourses, user, enrollments }: CourseDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all')

  const enrolledCourseIds = new Set(enrollments?.map((e) => e.course_id) || [])

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === 'enrolled') {
      return matchesSearch && enrolledCourseIds.has(course.id)
    }
    return matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/60 dark:bg-slate-900/40 p-4 rounded-2xl glass-card">
        {/* Left: Tabs + ThemeToggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
        <ThemeToggle />
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            All Courses ({initialCourses?.length || 0})
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'enrolled'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              My Enrollments ({enrolledCourseIds.size})
            </button>
          )}
        </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full px-4 py-2.5 pl-10 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3.5 top-3 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-2xl glass-card border border-slate-100 dark:border-slate-900 animate-fade-in">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">No courses found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria or switch tabs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => {
            const isEnrolled = enrolledCourseIds.has(course.id)
            return (
              <div
                key={course.id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden glass-card hover-lift border border-slate-100 dark:border-slate-800 animate-fade-in"
              >
                {/* Visual Header */}
                <div className="h-44 bg-gradient-to-br from-indigo-500/80 via-purple-500/80 to-pink-500/80 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/0 transition-colors duration-300" />
                  <span className="text-white text-5xl font-black select-none transform group-hover:scale-110 transition-transform duration-300">
                    {course.title[0]}
                  </span>
                  
                  {isEnrolled && (
                    <span className="absolute top-4 right-4 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md border border-emerald-400/30 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Enrolled
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between h-[220px]">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-2.5 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Milestones
                    </span>

                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors gap-0.5 group-hover:translate-x-1 duration-200"
                    >
                      {isEnrolled ? 'Open Course' : 'View Details'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
