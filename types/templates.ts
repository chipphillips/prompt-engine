export interface TemplateVariable {
    id: string;
    name: string;
    description: string;
    type: 'text' | 'number' | 'select';
    default_value?: string | number;
    options?: string[]; // For select type variables
}

export interface Template {
    id: string;
    name: string;
    description?: string;
    template: string;
    category?: string;
    tags?: string[];
    variables: TemplateVariable[];
    version?: number;
    parent_id?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    usage_count?: number;
}

export interface TemplateAnalysisResult {
    detectedVariables: TemplateVariable[];
    processedText: string;
}

export interface TemplateVersion {
    id: string;
    template_id: string;
    version: number;
    template: string;
    variables: TemplateVariable[];
    created_at: string;
    created_by?: string;
} 