'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface Milestone {
  title: string
  description: string
  order: number
}

export default function CourseForm({ course }: { course?: any }) {
  const [title, setTitle] = useState(course?.title || '')
  const [description, setDescription] = useState(course?.description || '')
  const [milestones, setMilestones] = useState<Milestone[]>(
    course?.milestones || [{ title: '', description: '', order: 0 }]
  )
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', order: milestones.length }])
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      if (course) {
        const { error: courseError } = await supabase
          .from('courses')
          .update({ title, description })
          .eq('id', course.id)

        if (courseError) throw courseError

        await supabase.from('milestones').delete().eq('course_id', course.id)

        const { error: milestoneError } = await supabase
          .from('milestones')
          .insert(
            milestones.filter(m => m.title).map((m, index) => ({ ...m, order: index, course_id: course.id }))
          )

        if (milestoneError) throw milestoneError
        setFeedback({ type: 'success', message: 'Course updated successfully!' })
      } else {
        const { data: newCourse, error: courseError } = await supabase
          .from('courses')
          .insert({ title, description })
          .select()

        if (courseError) throw courseError

        if (newCourse && newCourse[0]) {
          const { error: milestoneError } = await supabase
            .from('milestones')
            .insert(
              milestones.filter(m => m.title).map((m, index) => ({ ...m, order: index, course_id: newCourse[0].id }))
            )

          if (milestoneError) throw milestoneError
        }

        setFeedback({ type: 'success', message: 'Course published!' })
        setTitle('')
        setDescription('')
        setMilestones([{ title: '', description: '', order: 0 }])
      }

      router.refresh()
    } catch (error) {
      console.error('Error saving course:', error)
      setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 glass-card border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <span className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
        {course ? 'Edit Course' : 'New Course'}
      </h3>

      {feedback && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
            : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'
        }`}>
          {feedback.type === 'success' ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Master React & Next.js"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 dark:text-slate-100 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Description</label>
          <textarea
            required
            rows={3}
            placeholder="What will students learn in this course?"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 dark:text-slate-100 transition-all resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Milestones ({milestones.length})
            </label>
            <button
              type="button"
              onClick={addMilestone}
              className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {milestones.map((milestone, index) => (
              <div key={index} className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/60 rounded-xl space-y-2.5 relative group/item">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    Phase {index + 1}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  placeholder="Phase title"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 transition-all"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                />
                <textarea
                  rows={2}
                  placeholder="What will be covered in this phase?"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 transition-all resize-none"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full glowing-gradient text-white py-3.5 rounded-xl font-bold hover:opacity-95 shadow-md shadow-indigo-500/10 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : course ? (
            'Save Changes'
          ) : (
            'Publish Course'
          )}
        </button>
      </form>
    </div>
  )
}
