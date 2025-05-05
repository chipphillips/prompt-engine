import { Metadata } from 'next';
import React from 'react';
import ClientTemplateLibrary from '@/app/templates/client';

export const metadata: Metadata = {
    title: 'Template Library',
    description: 'Browse and manage AI prompt templates',
};

export default function TemplatesPage() {
    return (
        <div className="container mx-auto py-6">
            <ClientTemplateLibrary />
        </div>
    );
} 