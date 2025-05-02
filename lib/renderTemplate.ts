import Handlebars from 'handlebars';
import { PromptVariables } from './types';

export function renderTemplate(template: string, vars: Record<string, any>): string {
  const compiled = Handlebars.compile(template);
  return compiled(vars);
}
