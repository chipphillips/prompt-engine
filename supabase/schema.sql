-- Schema for Constructiv AI's Prompt Engine
-- This file contains SQL commands to set up the necessary tables in Supabase

-- Style Profiles Table
CREATE TABLE IF NOT EXISTS style_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  json_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompt Templates Table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template Versions Table
CREATE TABLE IF NOT EXISTS template_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES prompt_templates(id) ON DELETE CASCADE,
  version INT NOT NULL,
  template TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  UNIQUE (template_id, version)
);

-- Indexes for template versions
CREATE INDEX IF NOT EXISTS idx_template_versions_template_id
  ON template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_versions_template_version
  ON template_versions(template_id, version DESC);

-- Sample style profiles
INSERT INTO style_profiles (name, json_payload) VALUES 
('Professional', '{"tone": "professional", "formality": "high"}'),
('Casual', '{"tone": "casual", "formality": "low"}'),
('Technical', '{"tone": "technical", "formality": "high"}'),
('Construction Expert', '{"tone": "authoritative", "formality": "medium", "industry": "construction"}')
ON CONFLICT DO NOTHING;

-- Sample prompt templates
INSERT INTO prompt_templates (name, template) VALUES 
('Content Creation', 'Draft a {{content_type}} for {{target_audience}} with the purpose of {{stated_purpose}}. Use a {{content_style_profile_id}} tone and aim for {{intended_outcome}}. Think step by step before creating your first draft.'),
('Marketing Copy', 'Create {{content_type}} marketing copy targeting {{target_audience}}. The goal is to {{stated_purpose}} while maintaining a {{content_style_profile_id}} voice. The copy should drive {{intended_outcome}}.'),
('Construction Project Brief', 'Create a construction project brief for a {{project_type}} project. The client is a {{client_type}} and the project scope includes {{project_scope}}. Use a {{content_style_profile_id}} tone and include important considerations for {{key_consideration}}. The final deliverable should address {{project_timeline}} timeline constraints.'),
('Material Specification', 'Write a detailed specification for {{material_type}} to be used in a {{application_context}}. The specifications must meet {{standard_requirements}} and be suitable for {{environmental_conditions}}. Use a {{content_style_profile_id}} tone appropriate for construction professionals.'),
('Safety Procedure', 'Create a safety procedure for {{activity_type}} on a construction site. Include necessary {{equipment_needed}} and precautions for {{risk_factors}}. This document will be used by {{target_audience}} and should use a {{content_style_profile_id}} tone. Focus on compliance with {{regulation_standards}}.')
ON CONFLICT DO NOTHING;

-- Enable Row-Level Security (RLS)
ALTER TABLE style_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON style_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON prompt_templates
    FOR SELECT USING (true);

-- For authenticated users to create and update their own records
-- You can uncomment these when you add authentication
-- CREATE POLICY "Enable insert for authenticated users only" ON prompt_templates
--    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Enable update for owned records" ON prompt_templates
--    FOR UPDATE USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- Log of prompts
create table if not exists public.prompts_log (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_id uuid,
  prompt_object jsonb,
  result_tokens int,
  cost_usd numeric
);
