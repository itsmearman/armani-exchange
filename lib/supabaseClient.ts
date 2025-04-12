// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// lib/supabaseClient.ts
'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'

export const supabase = createPagesBrowserClient() // یا بدون <Database>
