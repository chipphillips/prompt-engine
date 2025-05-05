'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Template, TemplateVariable } from '@/types/templates';
import { Trash2, Plus, Wand2 } from 'lucide-react';

interface VariableIdentifierProps {
    templateText: string;
    variables: TemplateVariable[];
    onChange: (text: string, variables: TemplateVariable[]) => void;
}

export default function VariableIdentifier({
    templateText,
    variables,
    onChange
}: VariableIdentifierProps) {
    const [text, setText] = useState(templateText);
    const [vars, setVars] = useState<TemplateVariable[]>(variables);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        // If templateText changes externally, update local state
        setText(templateText);
    }, [templateText]);

    useEffect(() => {
        // If variables change externally, update local state
        setVars(variables);
    }, [variables]);

    const analyzeWithAI = async () => {
        if (!text) return;
        setIsAnalyzing(true);

        try {
            const response = await fetch('/api/templates/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze template');
            }

            const result = await response.json();

            // Merge new variables with existing ones
            // Keep existing variables that match by name, add new ones
            const existingVarNames = new Set(vars.map((v: TemplateVariable) => v.name));
            const newVars = result.detectedVariables.filter((v: TemplateVariable) => !existingVarNames.has(v.name));

            const updatedVars = [...vars, ...newVars];
            setVars(updatedVars);
            onChange(text, updatedVars);
        } catch (error) {
            console.error('Error analyzing template:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const addVariable = () => {
        const newVar: TemplateVariable = {
            id: uuidv4(),
            name: `variable_${vars.length + 1}`,
            description: 'New variable',
            type: 'text',
        };

        const updatedVars = [...vars, newVar];
        setVars(updatedVars);
        onChange(text, updatedVars);
    };

    const removeVariable = (id: string) => {
        const updatedVars = vars.filter(v => v.id !== id);
        setVars(updatedVars);
        onChange(text, updatedVars);
    };

    const updateVariable = (id: string, updates: Partial<TemplateVariable>) => {
        const updatedVars = vars.map(v =>
            v.id === id ? { ...v, ...updates } : v
        );
        setVars(updatedVars);
        onChange(text, updatedVars);
    };

    const handleTextChange = (newText: string) => {
        setText(newText);
        onChange(newText, vars);
    };

    const insertVariable = (variable: TemplateVariable) => {
        const variableTag = `{{${variable.name}}}`;
        const textArea = document.querySelector('textarea') as HTMLTextAreaElement;

        if (textArea) {
            const cursorPos = textArea.selectionStart;
            const textBefore = text.substring(0, cursorPos);
            const textAfter = text.substring(cursorPos);

            const newText = `${textBefore}${variableTag}${textAfter}`;
            setText(newText);
            onChange(newText, vars);

            // Focus and set cursor position after the inserted variable
            setTimeout(() => {
                textArea.focus();
                textArea.setSelectionRange(
                    cursorPos + variableTag.length,
                    cursorPos + variableTag.length
                );
            }, 0);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between items-center">
                                <span>Template Text</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={analyzeWithAI}
                                    disabled={isAnalyzing}
                                    className="flex items-center gap-1 text-sm"
                                >
                                    <Wand2 className="h-3 w-3" />
                                    {isAnalyzing ? "Analyzing..." : "Analyze Variables"}
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter your template text with {{variables}} in double curly braces..."
                                className="min-h-64 font-mono text-sm"
                                value={text}
                                onChange={(e) => handleTextChange(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Use double curly braces to define variables: e.g. {'{{'} variable_name {'}}'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between items-center">
                                <span>Variables</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addVariable}
                                    className="flex items-center gap-1 text-sm"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {vars.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    <p>No variables found</p>
                                    <p className="text-xs mt-1">
                                        Use the "Analyze Variables" button or add manually
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {vars.map((variable) => (
                                        <div key={variable.id} className="p-3 border rounded-md space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{`{{${variable.name}}}`}</div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeVariable(variable.id)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>

                                            <div className="grid gap-2">
                                                <div>
                                                    <label className="text-xs block text-muted-foreground mb-1">
                                                        Name
                                                    </label>
                                                    <Input
                                                        value={variable.name}
                                                        onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                                                        className="h-7 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs block text-muted-foreground mb-1">
                                                        Description
                                                    </label>
                                                    <Input
                                                        value={variable.description}
                                                        onChange={(e) => updateVariable(variable.id, { description: e.target.value })}
                                                        className="h-7 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs block text-muted-foreground mb-1">
                                                        Type
                                                    </label>
                                                    <Select
                                                        value={variable.type}
                                                        onValueChange={(value) => updateVariable(variable.id, {
                                                            type: value as 'text' | 'number' | 'select'
                                                        })}
                                                    >
                                                        <SelectTrigger className="h-7 text-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="select">Select</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {variable.type === 'select' && (
                                                    <div>
                                                        <label className="text-xs block text-muted-foreground mb-1">
                                                            Options (comma-separated)
                                                        </label>
                                                        <Input
                                                            value={variable.options?.join(', ') || ''}
                                                            onChange={(e) => updateVariable(variable.id, {
                                                                options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                            })}
                                                            className="h-7 text-sm"
                                                            placeholder="option1, option2, option3"
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => insertVariable(variable)}
                                                        className="w-full mt-1 text-xs h-7"
                                                    >
                                                        Insert into template
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Variable Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Variable</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vars.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No variables defined
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vars.map((variable) => (
                                        <TableRow key={variable.id}>
                                            <TableCell className="font-medium">{variable.name}</TableCell>
                                            <TableCell>{variable.description}</TableCell>
                                            <TableCell>{variable.type}</TableCell>
                                            <TableCell className="text-right">
                                                {variable.type === 'select' && variable.options
                                                    ? variable.options.join(', ')
                                                    : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 