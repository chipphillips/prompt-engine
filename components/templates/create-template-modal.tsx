'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Template, TemplateVariable } from '@/types/templates';
import VariableIdentifier from './variable-identifier';

interface CreateTemplateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateSuccess: (template: Template) => void;
    templateToEdit?: Template;
}

export default function CreateTemplateModal({
    open,
    onOpenChange,
    onCreateSuccess,
    templateToEdit
}: CreateTemplateModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [template, setTemplate] = useState('');
    const [category, setCategory] = useState('');
    const [variables, setVariables] = useState<TemplateVariable[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('scratch');
    const [existingText, setExistingText] = useState('');

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            if (templateToEdit) {
                // If editing an existing template, populate the form
                setName(templateToEdit.name);
                setDescription(templateToEdit.description || '');
                setTemplate(templateToEdit.template);
                setCategory(templateToEdit.category || '');
                setVariables(templateToEdit.variables || []);
                setActiveTab('scratch'); // Always start in the scratch tab when editing
            } else {
                // Reset form for new template
                setName('');
                setDescription('');
                setTemplate('');
                setCategory('');
                setVariables([]);
                setExistingText('');
            }
        }
    }, [open, templateToEdit]);

    const handleSubmit = async () => {
        if (!name || !template) {
            alert('Name and template are required');
            return;
        }

        setIsLoading(true);

        try {
            // Decide if we're creating or updating
            const url = templateToEdit
                ? `/api/templates/${templateToEdit.id}`
                : '/api/templates';

            const method = templateToEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    template,
                    category,
                    variables,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save template');
            }

            const savedTemplate = await response.json();
            onCreateSuccess(savedTemplate);
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeExistingText = async () => {
        if (!existingText) {
            alert('Please enter text to analyze');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/templates/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: existingText }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze text');
            }

            const result = await response.json();

            // Update the template and variables with the analyzed results
            setTemplate(result.processedText);
            setVariables(result.detectedVariables);

            // Switch to the editor tab
            setActiveTab('scratch');
        } catch (error) {
            console.error('Error analyzing text:', error);
            alert('Failed to analyze text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloneTemplate = async (templateId: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/templates/${templateId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch template');
            }

            const sourceTemplate = await response.json();

            // Populate the form with the source template data
            setName(`${sourceTemplate.name} (Copy)`);
            setDescription(sourceTemplate.description || '');
            setTemplate(sourceTemplate.template);
            setCategory(sourceTemplate.category || '');
            setVariables(sourceTemplate.variables || []);

            // Switch to the editor tab
            setActiveTab('scratch');
        } catch (error) {
            console.error('Error cloning template:', error);
            alert('Failed to clone template. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTemplateTextChange = (text: string, updatedVariables: TemplateVariable[]) => {
        setTemplate(text);
        setVariables(updatedVariables);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{templateToEdit ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                    <DialogDescription>
                        {templateToEdit
                            ? 'Make changes to your template and save them.'
                            : 'Create a new prompt template with variables.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="scratch">Create from Scratch</TabsTrigger>
                        <TabsTrigger value="existing">From Existing Text</TabsTrigger>
                        <TabsTrigger value="clone">Clone Template</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scratch" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Template name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g. Marketing, Technical, Sales"
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Short description of what this template is for"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Template Content</Label>
                            <VariableIdentifier
                                templateText={template}
                                variables={variables}
                                onChange={handleTemplateTextChange}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="existing" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="existingText">Paste your existing text</Label>
                            <textarea
                                id="existingText"
                                className="w-full min-h-40 p-2 border rounded-md"
                                value={existingText}
                                onChange={(e) => setExistingText(e.target.value)}
                                placeholder="Paste text here to convert into a template..."
                            />
                        </div>
                        <Button onClick={analyzeExistingText} disabled={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Analyze and Create Template'}
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            <p>
                                The analyzer will identify potential variables in your text
                                and convert them to the format {'{{variable_name}}'}.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="clone" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select a template to clone</Label>
                            <div className="border rounded-md p-4 h-60 overflow-y-auto">
                                <div className="space-y-2">
                                    {/* This would be populated with existing templates */}
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>Loading templates...</p>
                                        <p className="text-xs mt-1">
                                            This feature will be implemented in a future update.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !name || !template}
                    >
                        {isLoading
                            ? 'Saving...'
                            : templateToEdit
                                ? 'Update Template'
                                : 'Create Template'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 