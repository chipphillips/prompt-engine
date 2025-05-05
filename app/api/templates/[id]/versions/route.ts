import { NextRequest, NextResponse } from 'next/server';
import {
    getTemplateVersions,
    createTemplateVersion
} from '../../../../../lib/template-service';

/**
 * GET /api/templates/[id]/versions
 * Returns all versions of a template
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const templateId = params.id;
        const versions = await getTemplateVersions(templateId);

        return NextResponse.json(versions);
    } catch (error) {
        console.error('Error fetching template versions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch template versions' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/templates/[id]/versions
 * Creates a new version of a template
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const templateId = params.id;
        const { template, variables } = await request.json();

        if (!template) {
            return NextResponse.json(
                { error: 'Template content is required' },
                { status: 400 }
            );
        }

        const version = await createTemplateVersion(templateId, template, variables);

        if (!version) {
            return NextResponse.json(
                { error: 'Failed to create template version' },
                { status: 500 }
            );
        }

        return NextResponse.json(version, { status: 201 });
    } catch (error) {
        console.error('Error creating template version:', error);
        return NextResponse.json(
            { error: 'Failed to create template version' },
            { status: 500 }
        );
    }
} 