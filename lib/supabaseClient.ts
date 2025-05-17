import { createClient } from '@supabase/supabase-js';

// Mock data for development
const mockProfiles = [
  {
    id: '1',
    name: 'Professional',
    json_payload: { tone: 'professional', formality: 'high' }
  },
  {
    id: '2',
    name: 'Casual',
    json_payload: { tone: 'casual', formality: 'low' }
  },
  {
    id: '3',
    name: 'Technical',
    json_payload: { tone: 'technical', formality: 'high' }
  },
  {
    id: '4',
    name: 'Construction Expert',
    json_payload: { tone: 'authoritative', formality: 'medium', industry: 'construction' }
  }
];

const mockTemplates = [
  {
    id: '1',
    name: 'Content Creation',
    template: 'Draft a {{content_type}} for {{target_audience}} with the purpose of {{stated_purpose}}. Use a {{content_style_profile_id}} tone and aim for {{intended_outcome}}. Think step by step before creating your first draft.'
  },
  {
    id: '2',
    name: 'Marketing Copy',
    template: 'Create {{content_type}} marketing copy targeting {{target_audience}}. The goal is to {{stated_purpose}} while maintaining a {{content_style_profile_id}} voice. The copy should drive {{intended_outcome}}.'
  },
  {
    id: '3',
    name: 'Construction Project Brief',
    template: 'Create a construction project brief for a {{project_type}} project. The client is a {{client_type}} and the project scope includes {{project_scope}}. Use a {{content_style_profile_id}} tone and include important considerations for {{key_consideration}}. The final deliverable should address {{project_timeline}} timeline constraints.'
  },
  {
    id: '4',
    name: 'Material Specification',
    template: 'Write a detailed specification for {{material_type}} to be used in a {{application_context}}. The specifications must meet {{standard_requirements}} and be suitable for {{environmental_conditions}}. Use a {{content_style_profile_id}} tone appropriate for construction professionals.'
  },
  {
    id: '5',
    name: 'Safety Procedure',
    template: 'Create a safety procedure for {{activity_type}} on a construction site. Include necessary {{equipment_needed}} and precautions for {{risk_factors}}. This document will be used by {{target_audience}} and should use a {{content_style_profile_id}} tone. Focus on compliance with {{regulation_standards}}.'
  }
];

// Create a mock Supabase client for development
const mockSupabaseClient = {
  from: (table: string) => ({
    select: (query: string) => {
      // Mock the responses based on the table
      if (table === 'style_profiles') {
        return Promise.resolve({ data: mockProfiles, error: null });
      } else if (table === 'prompt_templates') {
        return Promise.resolve({ data: mockTemplates, error: null });
      }
      return Promise.resolve({ data: [], error: null });
    },
    insert: (data: any) => {
      console.log(`Mock insert into ${table}:`, data);
      return Promise.resolve({ data: { id: 'mock-id', ...data }, error: null });
    }
  })
};

// Determine whether to use real or mock client
const useRealSupabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Export either the real client or the mock client
export const supabase = useRealSupabase
  ? createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )
  : mockSupabaseClient as any;

/**
 * Logs a prompt to the prompts_log table
 */
export async function logPrompt(promptObject: any, result: string, userId?: string) {
  // Calculate approximate tokens (rough estimation)
  const promptText = JSON.stringify(promptObject);
  const promptTokens = Math.ceil(promptText.length / 4); // Rough estimation
  const resultTokens = Math.ceil(result.length / 4); // Rough estimation

  // Estimate cost (very rough - $0.01 per 1K tokens for GPT-4)
  const totalTokens = promptTokens + resultTokens;
  const estimatedCost = (totalTokens / 1000) * 0.01;

  const logEntry = {
    user_id: userId || null,
    prompt_object: promptObject,
    result_tokens: resultTokens,
    cost_usd: estimatedCost
  };

  console.log('Logging prompt to Supabase:', logEntry);

  return supabase.from('prompts_log').insert(logEntry);
}
