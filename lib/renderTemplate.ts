import Handlebars from 'handlebars';

/**
 * Renders a Handlebars template with provided variables
 * 
 * @param template The Handlebars template string with {{variables}}
 * @param variables The object containing values for variables
 * @returns The rendered template with variables replaced
 */
export function renderTemplate(template: string, variables: Record<string, any>): string {
  try {
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    // Execute the template with the variables
    return compiledTemplate(variables);
  } catch (error) {
    console.error('Error rendering template:', error);
    return 'Error: Template could not be rendered';
  }
}
