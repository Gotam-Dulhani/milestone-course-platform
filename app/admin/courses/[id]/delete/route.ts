import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  await supabase.from('milestones').delete().eq('course_id', params.id)
  await supabase.from('enrollments').delete().eq('course_id', params.id)
  await supabase.from('courses').delete().eq('id', params.id)

  revalidatePath('/admin')
  return NextResponse.redirect(new URL('/admin', req.url), {
    status: 302,
  })
}
