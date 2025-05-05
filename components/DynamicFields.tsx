import { StyleProfile } from '@/lib/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, CircleCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicFieldsProps {
    placeholders: string[];
    formValues: Record<string, string>;
    onChange: (name: string, value: string) => void;
    styleProfiles: StyleProfile[];
}

export default function DynamicFields({ placeholders, formValues, onChange, styleProfiles }: DynamicFieldsProps) {
    // Convert snake_case to Title Case with spaces
    const getFormattedLabel = (field: string) => {
        return field
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Get field description based on field name
    const getFieldDescription = (field: string) => {
        const descriptions: Record<string, string> = {
            content_type: 'The format of content you want to create (e.g., blog post, email, video script)',
            target_audience: 'Who will consume this content (e.g., contractors, homeowners, project managers)',
            stated_purpose: 'The primary goal of this content (e.g., educate, persuade, inform)',
            content_style_profile_id: 'The tone and voice for your content',
            intended_outcome: 'What action you want the audience to take (e.g., contact sales, download guide)',
        };

        return descriptions[field] || '';
    };

    // Render the appropriate input field based on the field name
    const renderField = (field: string) => {
        const label = getFormattedLabel(field);
        const description = getFieldDescription(field);
        const isCompleted = formValues[field] && formValues[field].trim() !== '';

        if (field === 'content_style_profile_id') {
            return (
                <div className="space-y-2" key={field}>
                    <div className="flex items-center justify-between">
                        <Label htmlFor={field} className="text-sm font-medium">
                            {label}
                        </Label>
                        {isCompleted && (
                            <span className="text-xs text-green-500 font-medium flex items-center">
                                <CheckIcon className="w-3 h-3 mr-1" />
                                Completed
                            </span>
                        )}
                    </div>
                    {description && <p className="text-xs text-gray-500">{description}</p>}

                    <Select
                        value={formValues[field] || ""}
                        onValueChange={(value) => onChange(field, value)}
                    >
                        <SelectTrigger
                            id={field}
                            className={cn(
                                "w-full",
                                isCompleted ? "border-green-200 bg-green-50" : ""
                            )}
                        >
                            <SelectValue placeholder="Select a style profile" />
                        </SelectTrigger>
                        <SelectContent>
                            {styleProfiles.map((profile) => (
                                <SelectItem key={profile.id} value={profile.id}>
                                    {profile.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {!formValues[field] && <p className="text-xs text-red-500 mt-1">Please select a style profile</p>}
                </div>
            );
        }

        // Default text input
        return (
            <div className="space-y-2" key={field}>
                <div className="flex items-center justify-between">
                    <Label htmlFor={field} className="text-sm font-medium">
                        {label}
                    </Label>
                    {isCompleted && (
                        <span className="text-xs text-green-500 font-medium flex items-center">
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Completed
                        </span>
                    )}
                </div>
                {description && <p className="text-xs text-gray-500">{description}</p>}
                <div className="relative">
                    <Input
                        type="text"
                        id={field}
                        value={formValues[field] || ''}
                        onChange={(e) => onChange(field, e.target.value)}
                        className={cn(
                            "w-full",
                            isCompleted ? "border-green-200 bg-green-50 pr-8" : ""
                        )}
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                    {isCompleted && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <CheckIcon className="w-4 h-4 text-green-500" />
                        </div>
                    )}
                </div>
                {!formValues[field] && <p className="text-xs text-red-500 mt-1">Please enter {label.toLowerCase()}</p>}
            </div>
        );
    };

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-5 space-y-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Complete all fields below</h4>
                {placeholders.map(field => renderField(field))}
                <div className="flex justify-between items-center pt-2 mt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        {Object.keys(formValues).length}/{placeholders.length} fields completed
                    </div>
                    {Object.keys(formValues).length === placeholders.length && (
                        <div className="text-sm text-green-500 font-medium flex items-center">
                            <CircleCheckIcon className="w-4 h-4 mr-1" />
                            All fields complete
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 