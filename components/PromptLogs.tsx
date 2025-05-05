'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PromptLog {
    id: number;
    created_at: string;
    prompt_object: {
        template: string;
        variables: Record<string, any>;
        rendered_prompt: string;
    };
    result_tokens: number;
    cost_usd: number;
}

interface PromptLogsProps {
    embedded?: boolean;
}

export default function PromptLogs({ embedded = false }: PromptLogsProps) {
    const [logs, setLogs] = useState<PromptLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        loadLogs();
    }, []);

    async function loadLogs() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('prompts_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error loading logs:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleString();
    }

    // If embedded, only render the logs content, not the button and container
    if (embedded) {
        return (
            <>
                {loading && <p className="text-gray-500 text-center py-4">Loading logs...</p>}

                {!loading && logs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No logs found.</p>
                ) : (
                    <div>
                        <button
                            onClick={loadLogs}
                            className="text-blue-500 hover:text-blue-700 text-sm mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Refresh Logs'}
                        </button>

                        <ul className="space-y-4">
                            {logs.map((log) => (
                                <li key={log.id} className="border-b border-gray-100 pb-3">
                                    <div className="text-xs text-gray-500">{formatDate(log.created_at)}</div>
                                    <div className="font-medium mt-1 truncate">{log.prompt_object.template.substring(0, 50)}...</div>
                                    <div className="flex justify-between mt-1 text-xs">
                                        <span className="text-gray-600">{log.result_tokens} tokens</span>
                                        <span className="text-gray-600">${log.cost_usd.toFixed(5)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        );
    }

    // Original standalone version with toggle button
    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={() => setVisible(!visible)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium shadow-md"
            >
                {visible ? 'Hide Logs' : 'Show Prompt Logs'}
            </button>

            {visible && (
                <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 md:w-96 max-h-[80vh] overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Prompts</h3>
                        <button
                            onClick={loadLogs}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    {logs.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No logs found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {logs.map((log) => (
                                <li key={log.id} className="border-b border-gray-100 pb-3">
                                    <div className="text-xs text-gray-500">{formatDate(log.created_at)}</div>
                                    <div className="font-medium mt-1 truncate">{log.prompt_object.template.substring(0, 50)}...</div>
                                    <div className="flex justify-between mt-1 text-xs">
                                        <span className="text-gray-600">{log.result_tokens} tokens</span>
                                        <span className="text-gray-600">${log.cost_usd.toFixed(5)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
} 