// Server-side Supabase connection test
import { createSupabaseServer } from '@/lib/supabase/admin'

export default async function TestSupabaseServerPage() {
  const supabase = createSupabaseServer()
  
  // Try to query the tools table
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .limit(1)
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Server Connection Test</h1>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error.message}</p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h2 className="font-bold">Success!</h2>
          <p>Connected to Supabase (server) and queried the tools table.</p>
          <p>Found {data?.length || 0} records.</p>
        </div>
      )}
    </div>
  )
}