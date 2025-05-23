'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Template } from '@/types/templates';
import CreateTemplateModal from '@/components/templates/create-template-modal';
import { Clock, Copy, Pencil, Search, Grid, List, Tag } from 'lucide-react';

export default function TemplateLibrary() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);

    useEffect(() => {
        async function fetchTemplates() {
            setIsLoading(true);
            try {
                const response = await fetch('/api/templates');
                const data = await response.json();
                setTemplates(data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTemplates();
    }, []);

    const filteredTemplates = templates.filter(template => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
            !selectedCategory ||
            (template.category && template.category.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    // Get unique categories
    const categories = Array.from(
        new Set(templates.map(t => t.category).filter(Boolean))
    ) as string[];

    const handleCopyTemplate = async (id: string) => {
        try {
            const template = templates.find(t => t.id === id);
            if (template) {
                await navigator.clipboard.writeText(template.template);
                alert('Template copied to clipboard!');
            }
        } catch (error) {
            console.error('Error copying template:', error);
        }
    };

    const handleCloneTemplate = async (id: string) => {
        try {
            const template = templates.find(t => t.id === id);
            if (template) {
                const response = await fetch(`/api/templates/${id}/clone`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: `${template.name} (Copy)` }),
                });

                if (response.ok) {
                    const newTemplate = await response.json();
                    setTemplates([...templates, newTemplate]);
                }
            }
        } catch (error) {
            console.error('Error cloning template:', error);
        }
    };

    const handleEditTemplate = (id: string) => {
        const template = templates.find(t => t.id === id);
        if (template) {
            setTemplateToEdit(template);
            setIsCreateModalOpen(true);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString();
    };

    const onCreateSuccess = (savedTemplate: Template) => {
        if (templateToEdit) {
            setTemplates(prev => prev.map(t => (t.id === savedTemplate.id ? savedTemplate : t)));
        } else {
            setTemplates([...templates, savedTemplate]);
        }
        setIsCreateModalOpen(false);
        setTemplateToEdit(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Template Library</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setView('grid')}
                        className={view === 'grid' ? 'bg-primary/10' : ''}
                    >
                        <Grid className="h-4 w-4 mr-2" />
                        Grid
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setView('list')}
                        className={view === 'list' ? 'bg-primary/10' : ''}
                    >
                        <List className="h-4 w-4 mr-2" />
                        List
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        Create Template
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 overflow-x-auto flex w-full justify-start">
                    <TabsTrigger
                        value="all"
                        onClick={() => setSelectedCategory(null)}
                        className="min-w-fit"
                    >
                        All Categories
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            onClick={() => setSelectedCategory(category)}
                            className="min-w-fit"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <>
                            {filteredTemplates.length === 0 ? (
                                <div className="text-center py-10">
                                    <h3 className="text-lg font-medium">No templates found</h3>
                                    <p className="text-muted-foreground mt-2">
                                        Try a different search term or category
                                    </p>
                                </div>
                            ) : (
                                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                                    {filteredTemplates.map((template) => (
                                        <Card key={template.id} className={view === 'list' ? 'overflow-hidden' : ''}>
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                                    {template.version && template.version > 1 && (
                                                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                                            v{template.version}
                                                        </span>
                                                    )}
                                                </div>
                                                {template.category && (
                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <Tag className="h-3 w-3 mr-1" />
                                                        {template.category}
                                                    </div>
                                                )}
                                                {template.description && (
                                                    <CardDescription className="mt-2 line-clamp-2">
                                                        {template.description}
                                                    </CardDescription>
                                                )}
                                            </CardHeader>
                                            <CardContent className="pb-3">
                                                <div className="text-sm text-muted-foreground line-clamp-3">
                                                    {template.template}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {formatDate(template.created_at)}
                                                    {template.usage_count !== undefined && template.usage_count > 0 && (
                                                        <span className="ml-2">
                                                            • Used {template.usage_count} times
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCopyTemplate(template.id)}
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                        <span className="sr-only">Copy</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCloneTemplate(template.id)}
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                        <span className="sr-only">Clone</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditTemplate(template.id)}
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>

                {/* Render the same content for each category tab */}
                {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-0">
                        {/* This content is controlled by the selectedCategory state, so we don't need separate filtering here */}
                        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                            {filteredTemplates.map((template) => (
                                <Card key={template.id} className={view === 'list' ? 'overflow-hidden' : ''}>
                                    {/* Same card content as above */}
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            {template.version && template.version > 1 && (
                                                <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                                    v{template.version}
                                                </span>
                                            )}
                                        </div>
                                        {template.category && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {template.category}
                                            </div>
                                        )}
                                        {template.description && (
                                            <CardDescription className="mt-2 line-clamp-2">
                                                {template.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                        <div className="text-sm text-muted-foreground line-clamp-3">
                                            {template.template}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDate(template.created_at)}
                                            {template.usage_count !== undefined && template.usage_count > 0 && (
                                                <span className="ml-2">
                                                    • Used {template.usage_count} times
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopyTemplate(template.id)}
                                            >
                                                <Copy className="h-3 w-3" />
                                                <span className="sr-only">Copy</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCloneTemplate(template.id)}
                                            >
                                                <Copy className="h-3 w-3" />
                                                <span className="sr-only">Clone</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditTemplate(template.id)}
                                            >
                                                <Pencil className="h-3 w-3" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <CreateTemplateModal
                open={isCreateModalOpen}
                onOpenChange={(open) => {
                    setIsCreateModalOpen(open);
                    if (!open) setTemplateToEdit(null);
                }}
                onCreateSuccess={onCreateSuccess}
                templateToEdit={templateToEdit || undefined}
            />
        </div>
    );
}
