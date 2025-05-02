-- Style profiles table
create table if not exists public.style_profiles (
  id text primary key,
  name text not null,
  json_payload jsonb not null
);

-- Prompt templates (optional)
create table if not exists public.prompt_templates (
  id text primary key,
  name text not null,
  template text not null
);

-- Log of prompts
create table if not exists public.prompts_log (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_id uuid,
  prompt_object jsonb,
  result_tokens int,
  cost_usd numeric
);
