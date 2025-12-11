'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnectionPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function checkConnection() {
            try {
                // Simple query to check connection. Using a non-existent table might throw an error 
                // that confirms connection vs network error, but ideally we check a real table.
                // For now, we'll assume authentication check is enough or try to fetch 'tasks' if expected.
                // Let's just check the session or a simple select.

                const { data, error } = await supabase.from('tasks').select('count', { count: 'exact', head: true })

                if (error) {
                    // If the table doesn't exist, Supabase might return a specific error (404-like)
                    // but that proves we reached Supabase.
                    // If we get a connection error, message will be different.
                    if (error.code === 'PGRST116' || error.code === '42P01') {
                        // 42P01 is undefined_table, which means we connected but table check failed. 
                        // That is still a "connection success" in terms of reachability.
                        setStatus('success')
                        setMessage('Connected to Supabase (Target table "tasks" not found, but service is reachable)')
                    } else {
                        setStatus('error')
                        setMessage(`Error: ${error.message} (Code: ${error.code})`)
                    }
                } else {
                    setStatus('success')
                    setMessage('Connected successfully to Supabase!')
                }
            } catch (err: any) {
                setStatus('error')
                setMessage(`Unexpected error: ${err.message}`)
            }
        }

        checkConnection()
    }, [])

    return (
        <div className="p-8 font-sans">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

            {status === 'loading' && <p>Checking connection...</p>}

            {status === 'success' && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <p className="font-bold">✓ Success</p>
                    <p>{message}</p>
                </div>
            )}

            {status === 'error' && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="font-bold">✗ Failed</p>
                    <p>{message}</p>
                </div>
            )}
        </div>
    )
}
