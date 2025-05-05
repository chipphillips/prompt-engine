import { StyleProfile } from '@/lib/types';

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
                <div className="form-control" key={field}>
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor={field} className="form-label">
                            {label}
                        </label>
                        {isCompleted && (
                            <span className="text-xs text-green-500 font-medium flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                Completed
                            </span>
                        )}
                    </div>
                    {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
                    <div className={`relative ${isCompleted ? 'has-value' : ''}`}>
                        <select
                            id={field}
                            name={field}
                            value={formValues[field] || ''}
                            onChange={(e) => onChange(field, e.target.value)}
                            className={`form-select pr-8 focus-constructiv ${!formValues[field] ? 'bg-gray-50' : 'bg-white border-gray-300'} ${isCompleted ? 'border-green-200 bg-green-50' : ''} w-full`}
                        >
                            <option value="">Select a style profile</option>
                            {styleProfiles.map((profile) => (
                                <option key={profile.id} value={profile.id}>
                                    {profile.name}
                                </option>
                            ))}
                        </select>
                        {isCompleted && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                    {!formValues[field] && <p className="form-error text-xs mt-1">Please select a style profile</p>}
                </div>
            );
        }

        // Default text input
        return (
            <div className="form-control" key={field}>
                <div className="flex items-center justify-between mb-1">
                    <label htmlFor={field} className="form-label">
                        {label}
                    </label>
                    {isCompleted && (
                        <span className="text-xs text-green-500 font-medium flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Completed
                        </span>
                    )}
                </div>
                {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
                <div className={`relative ${isCompleted ? 'has-value' : ''}`}>
                    <input
                        type="text"
                        id={field}
                        name={field}
                        value={formValues[field] || ''}
                        onChange={(e) => onChange(field, e.target.value)}
                        className={`form-input focus-constructiv ${!formValues[field] ? 'bg-gray-50' : 'bg-white border-gray-300'} ${isCompleted ? 'border-green-200 bg-green-50' : ''} w-full`}
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                    {isCompleted && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    )}
                </div>
                {!formValues[field] && <p className="form-error text-xs mt-1">Please enter {label.toLowerCase()}</p>}
            </div>
        );
    };

    return (
        <div className="space-y-5 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Complete all fields below</h4>
            {placeholders.map(field => renderField(field))}
            <div className="flex justify-between items-center pt-2 mt-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                    {Object.keys(formValues).length}/{placeholders.length} fields completed
                </div>
                {Object.keys(formValues).length === placeholders.length && (
                    <div className="text-sm text-green-500 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        All fields complete
                    </div>
                )}
            </div>
        </div>
    );
} 