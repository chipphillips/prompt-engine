import { NextRequest, NextResponse } from 'next/server';
import {
    getTemplates,
    createTemplate
} from '../../../lib/template-service';
import { Template } from '../../../types/templates';

/**
 * GET /api/templates
 * Returns all templates
 */
export async function GET() {
    try {
        const templates = await getTemplates();
        return NextResponse.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch templates' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/templates
 * Creates a new template
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.template) {
            return NextResponse.json(
                { error: 'Name and template are required' },
                { status: 400 }
            );
        }

        const template = await createTemplate(body);

        if (!template) {
            return NextResponse.json(
                { error: 'Failed to create template' },
                { status: 500 }
            );
        }

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json(
            { error: 'Failed to create template' },
            { status: 500 }
        );
    }
} 