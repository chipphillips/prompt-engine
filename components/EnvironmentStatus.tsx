'use client';

import React, { useEffect, useState } from 'react';
import { getEnvironmentStatus } from '../lib/checkEnv';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from '@/lib/utils';

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
        <Card className="fixed bottom-4 right-4 shadow-lg z-50 max-w-xs">
            <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between">
                <h4 className="font-semibold text-gray-700 text-xs">Environment Status</h4>
                <Button
                    onClick={() => setExpanded(!expanded)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
            </CardHeader>

            <CardContent className="p-3 pt-1 text-xs">
                <ul className="space-y-1">
                    <li className="flex items-center">
                        <span className={cn(
                            "w-3 h-3 rounded-full mr-2",
                            status.usingRealOpenAI ? 'bg-green-500' : 'bg-amber-500'
                        )}></span>
                        <span>OpenAI: {status.usingRealOpenAI ? 'Live API' : 'Mock Data'}</span>
                    </li>
                    <li className="flex items-center">
                        <span className={cn(
                            "w-3 h-3 rounded-full mr-2",
                            status.usingRealSupabase ? 'bg-green-500' : 'bg-amber-500'
                        )}></span>
                        <span>Supabase: {status.usingRealSupabase ? 'Live API' : 'Mock Data'}</span>
                    </li>
                </ul>
            </CardContent>

            {expanded && (
                <CardFooter className="p-3 pt-0 border-t border-gray-100 flex flex-col gap-2 text-xs">
                    <Button
                        onClick={fetchDebugInfo}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-7"
                    >
                        {loading ? 'Loading...' : 'Debug Server Environment'}
                    </Button>

                    {status.debugInfo && (
                        <div className="mt-1 bg-muted p-2 rounded overflow-auto max-h-40 text-xs w-full">
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
                </CardFooter>
            )}
        </Card>
    );
} 