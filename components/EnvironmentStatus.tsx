'use client';

import React, { useEffect, useState } from 'react';
import { getEnvironmentStatus } from '../lib/checkEnv';

interface EnvDetails {
    usingRealOpenAI: boolean;
    usingRealSupabase: boolean;
    debugInfo?: any;
}

export default function EnvironmentStatus() {
    const [status, setStatus] = useState<EnvDetails>({
        usingRealOpenAI: false,
        usingRealSupabase: false
    });
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Instead of just using client-side check, fetch the actual status
        fetchAPIStatus();
    }, []);

    const fetchAPIStatus = async () => {
        try {
            // Make a quick check to the debug endpoint
            const response = await fetch('/api/debug');
            if (response.ok) {
                const data = await response.json();
                setStatus({
                    usingRealOpenAI: data.environment?.OPENAI_API_KEY?.isSet || false,
                    usingRealSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
                    debugInfo: data
                });
            } else {
                // If debug endpoint fails, fall back to client-side check
                setStatus(getEnvironmentStatus());
            }
        } catch (error) {
            console.error('Error checking API status:', error);
            // Fall back to client-side check
            setStatus(getEnvironmentStatus());
        }
    };

    const fetchDebugInfo = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/debug');
            const data = await response.json();
            setStatus(prev => ({
                ...prev,
                debugInfo: data
            }));
        } catch (error) {
            console.error('Error fetching debug info:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-md shadow-lg p-3 text-xs border border-gray-200 z-50 max-w-xs">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-700">Environment Status</h4>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    {expanded ? '▲' : '▼'}
                </button>
            </div>

            <ul className="space-y-1">
                <li className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${status.usingRealOpenAI ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    <span>OpenAI: {status.usingRealOpenAI ? 'Live API' : 'Mock Data'}</span>
                </li>
                <li className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${status.usingRealSupabase ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    <span>Supabase: {status.usingRealSupabase ? 'Live API' : 'Mock Data'}</span>
                </li>
            </ul>

            {expanded && (
                <div className="mt-3 border-t border-gray-100 pt-2">
                    <button
                        onClick={fetchDebugInfo}
                        disabled={loading}
                        className="w-full text-center px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs transition-colors"
                    >
                        {loading ? 'Loading...' : 'Debug Server Environment'}
                    </button>

                    {status.debugInfo && (
                        <div className="mt-2 bg-gray-50 p-2 rounded overflow-auto max-h-40 text-xs">
                            <p className="font-semibold">API Key Status:</p>
                            <p>Set: {status.debugInfo.environment.OPENAI_API_KEY.isSet ? 'Yes' : 'No'}</p>
                            <p>Value: {status.debugInfo.environment.OPENAI_API_KEY.sanitizedValue}</p>
                            <p>Length: {status.debugInfo.environment.OPENAI_API_KEY.length}</p>
                            <p>Correct format: {status.debugInfo.environment.OPENAI_API_KEY.startsWithPrefix ? 'Yes' : 'No'}</p>
                            <p className="mt-2">Server: {status.debugInfo.serverInfo.platform} / {status.debugInfo.serverInfo.nodeVersion}</p>
                            <p>Environment: {status.debugInfo.environment.NODE_ENV}</p>
                            <p className="text-gray-400 mt-1">Updated: {new Date(status.debugInfo.time).toLocaleTimeString()}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 