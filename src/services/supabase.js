import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, { auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true } })
  : null

function unwrap({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

export const supabaseBackend = {
  async list(table, orderBy) {
    return unwrap(await supabase.from(table).select('*').order(orderBy, { ascending: true }))
  },
  async insert(table, row) {
    return unwrap(await supabase.from(table).insert(row).select().single())
  },
  async update(table, id, patch) {
    return unwrap(await supabase.from(table).update(patch).eq('id', id).select().single())
  },
  async remove(table, id) {
    unwrap(await supabase.from(table).delete().eq('id', id))
  },
  async removeWhere(table, column, value) {
    unwrap(await supabase.from(table).delete().eq(column, value))
  },
}
