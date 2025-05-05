/**
 * Helper utility to check if required environment variables are set
 * This is useful for debugging environment issues
 */

export function checkEnvironmentVariables() {
    const variables = {
        openai: process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    };

    console.table(variables);

    return variables;
}

/**
 * Simple utility to get environment status in a user-friendly format
 */
export function getEnvironmentStatus() {
    return {
        usingRealOpenAI: !!process.env.OPENAI_API_KEY,
        usingRealSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    };
} 