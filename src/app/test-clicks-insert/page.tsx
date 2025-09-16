// Test inserting into clicks table
'use client'

import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useState } from 'react'

export default function TestClicksInsertPage() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  
  const testClickInsert = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const supabase = createSupabaseBrowser()
      
      // Try to insert a test click
      const { error } = await supabase
        .from('clicks')
        .insert({
          tool_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
          referrer: 'http://localhost:3000/test',
          utm_source: 'test',
          utm_medium: 'test',
          utm_campaign: 'test'
        })
      
      if (error) {
        setResult({ success: false, message: error.message })
      } else {
        setResult({ success: true, message: 'Successfully inserted test click record' })
      }
    } catch (error) {
      setResult({ success: false, message: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Clicks Insert Test</h1>
      <button 
        onClick={testClickInsert}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Click Insert'}
      </button>
      
      {result && (
        <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
          <h2 className="font-bold">{result.success ? 'Success!' : 'Error:'}</h2>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  )
}