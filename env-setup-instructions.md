# Setting Up Environment Variables

Create a file named `.env.local` in the root of your project with the following variables:

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional - Supabase Service Role (for server operations only, if needed)
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## How to Get These Values

### OpenAI API Key
1. Go to [OpenAI's platform](https://platform.openai.com/account/api-keys)
2. Create an account or log in
3. Navigate to the API keys section
4. Create a new API key
5. Copy the key (it starts with "sk-")

### Supabase Credentials
1. Go to [Supabase](https://supabase.com/)
2. Log in to your account
3. Select your project (or create a new one)
4. Go to Project Settings > API
5. Copy the "Project URL" (for NEXT_PUBLIC_SUPABASE_URL)
6. Copy the "anon public" key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)
7. The service role key is also available here if needed (use with caution, as it has full admin rights)

## After Setting Up
After creating the `.env.local` file with your credentials, restart your development server:

```bash
pnpm run dev
``` 