'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    try {
      setStatus('loading');
      
      // Test connection by fetching version
      const { data, error } = await supabase.from('tools').select('count');
      
      if (error) {
        throw error;
      }
      
      setResult(data);
      setStatus('success');
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      setResult(error);
      setStatus('error');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      <button
        onClick={testConnection}
        disabled={status === 'loading'}
        className="w-full bg-[#F26B21] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#F26B21]/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Testing...' : 'Test Connection'}
      </button>
      
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">Connection successful!</p>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Connection failed</p>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}