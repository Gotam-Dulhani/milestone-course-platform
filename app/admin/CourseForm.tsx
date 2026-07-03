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

    try {
      if (course) {
        // Update existing course
        const { error: courseError } = await supabase
          .from('courses')
          .update({ title, description })
          .eq('id', course.id)

        if (courseError) throw courseError

        // Delete existing milestones
        await supabase.from('milestones').delete().eq('course_id', course.id)

        // Insert updated milestones list
        const { error: milestoneError } = await supabase
          .from('milestones')
          .insert(
            milestones.filter(m => m.title).map((m, index) => ({ ...m, order: index, course_id: course.id }))
          )

        if (milestoneError) throw milestoneError
      } else {
        // Create new course
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
      }

      router.refresh()
      if (!course) {
        setTitle('')
        setDescription('')
        setMilestones([{ title: '', description: '', order: 0 }])
      }
    } catch (error) {
      console.error('Error saving course:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 glass-card border border-slate-100 dark:border-slate-800 shadow-md">
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2.5 h-6 glowing-gradient rounded-full" />
        {course ? 'Edit Course Info' : 'Create New Course'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Course Title</label>
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
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Course Description</label>
          <textarea
            required
            rows={3}
            placeholder="Describe the course goals, stack, and target audience..."
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 dark:text-slate-100 transition-all resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Milestones Setup</label>
            <button
              type="button"
              onClick={addMilestone}
              className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Phase
            </button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {milestones.map((milestone, index) => (
              <div key={index} className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850/60 rounded-xl space-y-3 relative group/item">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider">Phase {index + 1}</span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-semibold opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
                    >
                      Delete Phase
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Phase Title (e.g. Next.js Routing)"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 transition-all"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  />
                  <textarea
                    rows={2}
                    placeholder="Briefly explain what will be covered in this phase..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 transition-all resize-none"
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full glowing-gradient text-white py-3.5 rounded-xl font-bold hover:opacity-95 shadow-md shadow-indigo-500/10 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : course ? 'Save Changes' : 'Publish Course'}
        </button>
      </form>
    </div>
  )
}
