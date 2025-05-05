import { NextRequest, NextResponse } from 'next/server';
import {
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    cloneTemplate
} from '../../../../lib/template-service';

/**
 * GET /api/templates/[id]
 * Returns a specific template
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const template = await getTemplateById(id);

        if (!template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error fetching template:', error);
        return NextResponse.json(
            { error: 'Failed to fetch template' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/templates/[id]
 * Updates a specific template
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();

        const updatedTemplate = await updateTemplate(id, body);

        if (!updatedTemplate) {
            return NextResponse.json(
                { error: 'Failed to update template' },
                { status: 500 }
            );
        }

        return NextResponse.json(updatedTemplate);
    } catch (error) {
        console.error('Error updating template:', error);
        return NextResponse.json(
            { error: 'Failed to update template' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/templates/[id]
 * Deletes a specific template
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const success = await deleteTemplate(id);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to delete template' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json(
            { error: 'Failed to delete template' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/templates/[id]/clone
 * Clones a template
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const { name } = await request.json();

        const clonedTemplate = await cloneTemplate(id, name);

        if (!clonedTemplate) {
            return NextResponse.json(
                { error: 'Failed to clone template' },
                { status: 500 }
            );
        }

        return NextResponse.json(clonedTemplate, { status: 201 });
    } catch (error) {
        console.error('Error cloning template:', error);
        return NextResponse.json(
            { error: 'Failed to clone template' },
            { status: 500 }
        );
    }
} 