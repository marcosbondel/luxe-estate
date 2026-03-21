'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { createAdminClient } from '@/src/lib/supabase/admin'

export type UserRole = 'admin' | 'agent' | 'user'

/** Update the role of a user. Only admins may call this. */
export async function updateUserRole(userId: string, role: UserRole) {
  // Verify the caller is an admin via their session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthenticated' }
  }

  const { data: callerRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (callerRole?.role !== 'admin') {
    return { error: 'Forbidden' }
  }

  // Perform the update with the admin client (bypasses RLS)
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('user_roles')
    .update({ role })
    .eq('user_id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/[lang]/admin/users', 'page')
  return { success: true }
}

/** Fetch all user_roles rows (admin only). */
export async function getAllUsers() {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}
