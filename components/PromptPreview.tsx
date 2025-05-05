// PromptPreview.tsx
'use client';

import { useEffect, useState } from 'react';
import { renderTemplate } from '@/lib/renderTemplate';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

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

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(prompt);
    };

    // Format the preview with syntax highlighting for unfilled placeholders
    const formatPreview = () => {
        if (!prompt) {
            return (
                <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded border border-dashed border-gray-200">
                    <FileText className="w-16 h-16 text-gray-300 mb-2" />
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
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Your Prompt</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={cn("text-xs font-medium", getCharacterCountColor())}>
                        {characterCount} characters
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleCopyToClipboard}
                        title="Copy prompt"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-4 font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto custom-scrollbar">
                {formatPreview()}
            </CardContent>
        </Card>
    );
}
