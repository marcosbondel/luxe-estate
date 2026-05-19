'use server'

import { revalidatePath } from 'next/cache'
import { mockUsers } from '@/src/data/mockProperties'

export type UserRole = 'admin' | 'agent' | 'user'

export async function updateUserRole(_userId: string, _role: UserRole): Promise<{ success?: boolean; error?: string }> {
  revalidatePath('/[lang]/admin/users', 'page')
  return { success: true }
}

export async function getAllUsers() {
  return { data: mockUsers, error: null }
}
