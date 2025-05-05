// TemplateSelect.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Search } from "lucide-react";
import { cn } from '@/lib/utils';

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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    className="pl-10 w-full"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredTemplates.length === 0 ? (
                <Card className="bg-gray-50 border-dashed">
                    <CardContent className="p-6 text-center">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        <p className="font-medium text-gray-500">No templates found</p>
                        <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(groupedTemplates).map(([category, templatesList]) => (
                        <div key={category} className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{category}</h4>
                            {templatesList.map((template) => (
                                <Card
                                    key={template.id}
                                    className={cn(
                                        "cursor-pointer transition-all hover:shadow-md",
                                        selectedTemplate === template.id
                                            ? "border-primary border-2 bg-primary/5"
                                            : "border-border hover:border-primary/20"
                                    )}
                                    onClick={() => onChange(template.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                                                selectedTemplate === template.id
                                                    ? "bg-primary"
                                                    : "bg-gray-100"
                                            )}>
                                                {selectedTemplate === template.id ? (
                                                    <Check className="h-4 w-4 text-white" />
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
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
