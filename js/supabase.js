import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://obcwkdyvznndjvkqsmxq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iY3drZHl2em5uZGp2a3FzbXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MDI3ODYsImV4cCI6MjA5NjM3ODc4Nn0.kF53qIf5LebPTfBx3S7w-g8wVlUApHSu2b_tstOZ7dc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})