// PromptPreview.tsx
'use client';

import { useEffect, useState } from 'react';

interface PromptPreviewProps {
    prompt: string;
}

export default function PromptPreview({ prompt }: PromptPreviewProps) {
    // Count characters in prompt
    const characterCount = prompt.length;

    // Get a color based on character count for a visual guide
    const getCharacterCountColor = () => {
        if (characterCount < 100) return 'text-green-500';
        if (characterCount < 200) return 'text-blue-500';
        if (characterCount < 300) return 'text-amber-500';
        return 'text-red-500';
    };

    // Format the preview with syntax highlighting for unfilled placeholders
    const formatPreview = () => {
        if (!prompt) {
            return (
                <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded border border-dashed border-gray-200">
                    <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">No preview available</p>
                    <p className="text-gray-400 text-sm mt-1">Select a template to get started</p>
                </div>
            );
        }

        return (
            <div>
                <p className="whitespace-pre-line">{prompt}</p>
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Your Prompt</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`text-xs ${getCharacterCountColor()} font-medium`}>
                        {characterCount} characters
                    </span>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => navigator.clipboard.writeText(prompt)}
                        title="Copy prompt"
                        type="button"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-4 font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto custom-scrollbar">
                {formatPreview()}
            </div>
        </div>
    );
}
