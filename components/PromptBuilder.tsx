'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { renderTemplate } from '@/lib/renderTemplate';
import { PromptVariables, PromptObject } from '@/lib/types';

interface StyleProfile {
  id: string;
  name: string;
  json_payload: Record<string, unknown>;
}

export default function PromptBuilder() {
  const [profiles, setProfiles] = useState<StyleProfile[]>([]);
  const [form, setForm] = useState({
    content_type: '',
    target_audience: '',
    stated_purpose: '',
    content_style_profile_id: '',
    intended_outcome: ''
  });
  const [preview, setPreview] = useState<string>('');
  const template = `Draft a {{content_type}} targeting {{target_audience}} for the purpose of {{stated_purpose}}. 
Please be sure to follow the {{content_style_profile.name}} to ensure we are developing content that speaks directly to our target audience. 
Remember this is communicating through {{content_type}} so that {{target_audience}} understands, finds value, and takes action.

The action we want the target audience to take is {{intended_outcome}}.

Take a deep breath & think through this step by step before creating your first draft.`;

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('style_profiles').select('*');
      if (!error && data) setProfiles(data as any);
    })();
  }, []);

  useEffect(() => {
    const style = profiles.find(p => p.id === form.content_style_profile_id);
    if (!style) return setPreview('');
    const filled = renderTemplate(template, {
      ...form,
      content_style_profile: style
    });
    setPreview(filled);
  }, [form, profiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const style = profiles.find(p => p.id === form.content_style_profile_id);
    if (!style) return;
    const payload: PromptObject = {
      template,
      variables: {
        ...form,
        content_style_profile: style.json_payload
      } as any
    };

    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert('AI request failed');
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="content_type" placeholder="Content Type" onChange={handleChange} className="border p-2 w-full" />
        <input name="target_audience" placeholder="Target Audience" onChange={handleChange} className="border p-2 w-full" />
        <input name="stated_purpose" placeholder="Purpose" onChange={handleChange} className="border p-2 w-full" />
        <select name="content_style_profile_id" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select Style Profile</option>
          {profiles.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input name="intended_outcome" placeholder="Intended Outcome" onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Generate</button>
      </form>

      {preview && (
        <div className="border p-4 whitespace-pre-wrap bg-gray-50">
          <h3 className="font-bold mb-2">Prompt Preview</h3>
          {preview}
        </div>
      )}
    </div>
  );
}
