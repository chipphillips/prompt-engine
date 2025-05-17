// usePlaceholders.ts
"use client"

import { useEffect, useState } from "react"

/**
 * Hook to extract Handlebars placeholders from a template string
 * @param template The Handlebars template string
 * @returns Array of placeholder names found in the template
 */
export function usePlaceholders(template: string): string[] {
    const [placeholders, setPlaceholders] = useState<string[]>([])

    useEffect(() => {
        setPlaceholders(extractPlaceholders(template))
    }, [template])

    return placeholders
}

/**
 * Utility function to extract placeholders synchronously
 * @param template The template string containing {{placeholders}}
 * @returns Array of unique placeholder names
 */
export function extractPlaceholders(template: string): string[] {
    if (!template) return []

    const placeholderRegex = /\{\{([^#\/][^}]*)\}\}/g
    const matches = [...template.matchAll(placeholderRegex)]
    const extractedFields = matches
        .map((match) => match[1].trim())
        .filter((name) => name !== 'else' && !name.includes(' '))

    // Remove duplicates
    return [...new Set(extractedFields)]
}
