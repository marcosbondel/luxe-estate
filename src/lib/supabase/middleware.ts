import { NextResponse, type NextRequest } from 'next/server'

export interface SessionResult {
  response: NextResponse
  userId: string | null
}

export async function updateSession(request: NextRequest): Promise<SessionResult> {
  const response = NextResponse.next({ request })
  return { response, userId: null }
}
