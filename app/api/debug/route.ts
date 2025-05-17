import { NextResponse } from 'next/server';

export async function GET() {
    // Sanitize the API key for security (only show first and last few characters)
    const sanitizeKey = (key: string | undefined) => {
        if (!key) return 'undefined';
        if (key.length < 10) return '***';
        return `${key.substring(0, 3)}...${key.substring(key.length - 3)}`;
    };

    const apiKeyInfo = {
        isSet: !!process.env.OPENAI_API_KEY,
        sanitizedValue: sanitizeKey(process.env.OPENAI_API_KEY),
        length: process.env.OPENAI_API_KEY?.length || 0,
        startsWithPrefix: process.env.OPENAI_API_KEY?.startsWith('sk-') || false
    };

    const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        OPENAI_API_KEY: apiKeyInfo,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    };

    return NextResponse.json({
        environment: envVars,
        time: new Date().toISOString(),
        serverInfo: {
            platform: process.platform,
            nodeVersion: process.version,
        }
    });
} 