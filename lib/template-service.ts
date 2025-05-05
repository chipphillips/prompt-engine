import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';
import { Template, TemplateVariable, TemplateAnalysisResult, TemplateVersion } from '@/types/templates';

/**
 * Get all templates from the database
 */
export async function getTemplates(): Promise<Template[]> {
    // Check if we're using the mock client or real Supabase
    if (typeof supabase.from('prompt_templates').select === 'function') {
        const { data, error } = await supabase
            .from('prompt_templates')
            .select('*');

        if (error) {
            console.error('Error fetching templates:', error);
            return [];
        }

        // Convert the database format to our Template interface
        return data.map((item: any) => {
            // Extract variables from template string using regex
            const variableMatches = [...item.template.matchAll(/\{\{([^}]+)\}\}/g)];
            const variables: TemplateVariable[] = variableMatches.map((match) => {
                const name = match[1].trim();
                return {
                    id: uuidv4(),
                    name,
                    description: `Value for ${name}`,
                    type: 'text',
                };
            });

            return {
                id: item.id,
                name: item.name,
                description: item.description || '',
                template: item.template,
                category: item.category || item.name.split(' ')[0],
                tags: item.tags || [],
                variables,
                version: item.version || 1,
                created_at: item.created_at,
                updated_at: item.updated_at,
                created_by: item.created_by,
                usage_count: item.usage_count || 0
            };
        });
    } else {
        // For mock data, use the format from the mock client
        const { data } = await supabase.from('prompt_templates').select('*');
        return data.map((item: any) => {
            const variableMatches = [...item.template.matchAll(/\{\{([^}]+)\}\}/g)];
            const variables: TemplateVariable[] = variableMatches.map((match) => {
                const name = match[1].trim();
                return {
                    id: uuidv4(),
                    name,
                    description: `Value for ${name}`,
                    type: 'text',
                };
            });

            return {
                id: item.id,
                name: item.name,
                description: '',
                template: item.template,
                category: item.name.split(' ')[0],
                tags: [],
                variables,
                version: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                usage_count: 0
            };
        });
    }
}

/**
 * Get a single template by ID
 */
export async function getTemplateById(id: string): Promise<Template | null> {
    const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching template:', error);
        return null;
    }

    // Extract variables from template string
    const variableMatches = [...data.template.matchAll(/\{\{([^}]+)\}\}/g)];
    const variables: TemplateVariable[] = variableMatches.map((match) => {
        const name = match[1].trim();
        return {
            id: uuidv4(),
            name,
            description: `Value for ${name}`,
            type: 'text',
        };
    });

    return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        template: data.template,
        category: data.category || data.name.split(' ')[0],
        tags: data.tags || [],
        variables,
        version: data.version || 1,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by,
        usage_count: data.usage_count || 0
    };
}

/**
 * Create a new template
 */
export async function createTemplate(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<Template | null> {
    const { data, error } = await supabase
        .from('prompt_templates')
        .insert({
            name: template.name,
            description: template.description || '',
            template: template.template,
            category: template.category,
            tags: template.tags || [],
            variables: JSON.stringify(template.variables),
            version: 1
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating template:', error);
        return null;
    }

    return {
        ...template,
        id: data.id,
        version: 1,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
}

/**
 * Update an existing template
 */
export async function updateTemplate(id: string, template: Partial<Template>): Promise<Template | null> {
    const { data, error } = await supabase
        .from('prompt_templates')
        .update({
            name: template.name,
            description: template.description,
            template: template.template,
            category: template.category,
            tags: template.tags,
            variables: template.variables ? JSON.stringify(template.variables) : undefined,
            version: template.version,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating template:', error);
        return null;
    }

    return data as unknown as Template;
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('prompt_templates')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting template:', error);
        return false;
    }

    return true;
}

/**
 * Clone a template
 */
export async function cloneTemplate(id: string, newName: string): Promise<Template | null> {
    const template = await getTemplateById(id);

    if (!template) {
        return null;
    }

    const { id: _, ...templateWithoutId } = template;

    const newTemplate = {
        ...templateWithoutId,
        name: newName || `${template.name} (Copy)`,
        parent_id: template.id,
    };

    return createTemplate(newTemplate);
}

/**
 * Analyze a template using simple regex
 * This is a placeholder for AI-based analysis
 */
export function analyzeTemplateWithRegex(text: string): TemplateAnalysisResult {
    // Detect variables in format {{variable_name}}
    const variableMatches = [...text.matchAll(/\{\{([^}]+)\}\}/g)];

    // Create unique variables based on name
    const uniqueVars = new Map<string, TemplateVariable>();

    variableMatches.forEach((match) => {
        const name = match[1].trim();
        if (!uniqueVars.has(name)) {
            uniqueVars.set(name, {
                id: uuidv4(),
                name,
                description: `Value for ${name}`,
                type: 'text',
            });
        }
    });

    return {
        detectedVariables: Array.from(uniqueVars.values()),
        processedText: text
    };
}

/**
 * Get template versions
 */
export async function getTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
    const { data, error } = await supabase
        .from('template_versions')
        .select('*')
        .eq('template_id', templateId)
        .order('version', { ascending: false });

    if (error) {
        console.error('Error fetching template versions:', error);
        return [];
    }

    return data as unknown as TemplateVersion[];
}

/**
 * Create a new template version
 */
export async function createTemplateVersion(
    templateId: string,
    template: string,
    variables: TemplateVariable[]
): Promise<TemplateVersion | null> {
    // Get current highest version
    const { data: versionData, error: versionError } = await supabase
        .from('template_versions')
        .select('version')
        .eq('template_id', templateId)
        .order('version', { ascending: false })
        .limit(1);

    if (versionError) {
        console.error('Error getting template version:', versionError);
        return null;
    }

    const newVersion = versionData && versionData.length > 0 ? versionData[0].version + 1 : 1;

    const { data, error } = await supabase
        .from('template_versions')
        .insert({
            template_id: templateId,
            version: newVersion,
            template,
            variables: JSON.stringify(variables),
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating template version:', error);
        return null;
    }

    // Update the template's version
    await supabase
        .from('prompt_templates')
        .update({ version: newVersion })
        .eq('id', templateId);

    return data as unknown as TemplateVersion;
} 