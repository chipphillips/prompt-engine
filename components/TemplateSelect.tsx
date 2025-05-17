// TemplateSelect.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

/*
SQL to create prompt_templates table:
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some initial templates
INSERT INTO prompt_templates (name, template) VALUES 
('Content Creation', 'Draft a {{content_type}} for {{target_audience}} with the purpose of {{stated_purpose}}. Use a {{content_style_profile_id}} tone and aim for {{intended_outcome}}. Think step by step before creating your first draft.'),
('Marketing Copy', 'Create {{content_type}} marketing copy targeting {{target_audience}}. The goal is to {{stated_purpose}} while maintaining a {{content_style_profile_id}} voice. The copy should drive {{intended_outcome}}.'),
('Social Media Post', 'Write a {{content_type}} social media post for {{target_audience}}. The post should {{stated_purpose}} with a {{content_style_profile_id}} style and encourage {{intended_outcome}}.');
*/

interface Template {
    id: string;
    name: string;
    template: string;
}

interface TemplateSelectProps {
    templates: Template[];
    selectedTemplate: string;
    onChange: (templateId: string) => void;
}

export default function TemplateSelect({ templates, selectedTemplate, onChange }: TemplateSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get the template categories (assuming first word of name is category)
    const getTemplateCategory = (name: string) => {
        return name.split(' ')[0];
    };

    const groupedTemplates = filteredTemplates.reduce((acc, template) => {
        const category = getTemplateCategory(template.name);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(template);
        return acc;
    }, {} as Record<string, Template[]>);

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="form-input pl-10 focus-constructiv w-full"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredTemplates.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-lg text-gray-500 text-center border border-dashed border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <p className="font-medium">No templates found</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(groupedTemplates).map(([category, templatesList]) => (
                        <div key={category} className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{category}</h4>
                            {templatesList.map((template) => (
                                <div
                                    key={template.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedTemplate === template.id
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                                            : 'border-gray-200 bg-white hover:border-blue-200'
                                        }`}
                                    onClick={() => onChange(template.id)}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTemplate === template.id ? 'bg-blue-500' : 'bg-gray-100'
                                            } mr-3`}>
                                            {selectedTemplate === template.id ? (
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            ) : (
                                                <span className="text-gray-500 text-xs">{template.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{template.name}</p>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {template.template.substring(0, 100)}
                                                {template.template.length > 100 ? '...' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
