'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { cn } from '@/lib/utils';

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
                        <Button
                            onClick={loadLogs}
                            variant="link"
                            className="text-blue-500 hover:text-blue-700 p-0 h-auto text-sm mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : (
                                <>
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Refresh Logs
                                </>
                            )}
                        </Button>

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
            <Button
                onClick={() => setVisible(!visible)}
                variant={visible ? "outline" : "default"}
                size="sm"
            >
                {visible ? 'Hide Logs' : 'Show Prompt Logs'}
            </Button>

            {visible && (
                <Card className="mt-2 w-80 md:w-96 max-h-[80vh] overflow-auto">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Prompts</h3>
                            <Button
                                onClick={loadLogs}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={loading}
                            >
                                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
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
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 