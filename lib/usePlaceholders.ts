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
        if (!template) {
            setPlaceholders([])
            return
        }

        // Regular expression to match variable placeholders only
        // Matches {{variable}} but skips helpers like {{#if}}, {{/if}}, and {{else}}
        const regex = /{{(?![#\/]|else\b)([^}]+?)}}/g
        const matches = template.match(regex) || []

        // Extract variable names and clean them
        const extractedPlaceholders = matches
            .map(match => match.replace(/{{|}}/g, '').trim())
            .filter(placeholder => !placeholder.includes(' ')) // Filter out helpers with arguments
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

        setPlaceholders(extractedPlaceholders)
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

    // Match variable placeholders only, skipping helpers
    const placeholderRegex = /\{\{(?![#\/]|else\b)([^}]+?)\}\}/g
    const matches = [...template.matchAll(placeholderRegex)]
    const extractedFields = matches.map((match) => match[1].trim())

    // Remove duplicates
    return [...new Set(extractedFields)]
}
