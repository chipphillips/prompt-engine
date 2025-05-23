import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { analyzeTemplateWithRegex } from '../../../../lib/template-service';
import { TemplateVariable } from '../../../../types/templates';
import OpenAI from 'openai';

// Log OpenAI initialization status (without exposing the full key)
const openaiApiKey = process.env.OPENAI_API_KEY;
const isMockKey = !openaiApiKey || openaiApiKey === 'sk-mock-key';
console.log(`OpenAI API Key status: ${openaiApiKey ? 'Provided' : 'Missing'}`);
console.log(`Using mock data for template analysis: ${isMockKey}`);

const openai = new OpenAI({
    apiKey: openaiApiKey || 'sk-mock-key'
});

/**
 * POST /api/templates/analyze
 * Analyzes a template text for variables
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Template text is required' },
                { status: 400 }
            );
        }

        const result = await analyzeTemplateWithAI(text);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error analyzing template:', error);
        return NextResponse.json(
            { error: 'Failed to analyze template' },
            { status: 500 }
        );
    }
}

async function analyzeTemplateWithAI(text: string) {
    // If we're definitely using a mock key, fall back to regex
    if (isMockKey) {
        console.log('Using regex analyzer due to missing/invalid API key');
        return analyzeTemplateWithRegex(text);
    }

    try {
        const systemPrompt =
            'Analyze the following template text and identify variables in the format {{variable_name}}. ' +
            'Return JSON with "processedText" and "detectedVariables" (each variable should have name, description, and type).';

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message.content || '{}';
        const parsed = JSON.parse(content);

        const processedText = parsed.processedText || text;
        const detectedVariables: TemplateVariable[] = Array.isArray(parsed.detectedVariables)
            ? parsed.detectedVariables.map((v: any) => ({
                  id: uuidv4(),
                  name: v.name,
                  description: v.description || `Value for ${v.name}`,
                  type:
                      v.type === 'number' || v.type === 'select'
                          ? v.type
                          : 'text'
              }))
            : [];

        return { processedText, detectedVariables };
    } catch (error) {
        console.error('AI analysis failed, falling back to regex:', error);
        return analyzeTemplateWithRegex(text);
    }
}
