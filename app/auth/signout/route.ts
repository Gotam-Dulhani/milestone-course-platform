import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()

  // 1. Sign out from Supabase
  await supabase.auth.signOut()

  // 2. Create redirect response to home
  const response = NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })

  // 3. Clear ALL Supabase cookies COMPLETELY
  // Get all cookie names from the request
  const cookieNames = req.cookies.getAll().map(c => c.name)
  
  // Delete every cookie that starts with 'sb-' (Supabase cookies)
  cookieNames.forEach(name => {
    if (name.startsWith('sb-')) {
      response.cookies.delete(name)
    }
  })

  // 4. Also set specific cookie deletions just to be safe
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')
  response.cookies.delete('sb-auth-token')

  // 5. Revalidate all paths to clear cache
  revalidatePath('/', 'layout')
  revalidatePath('/admin')
  revalidatePath('/student')
  revalidatePath('/auth/signin')
  revalidatePath('/auth/signup')

  return response
}
