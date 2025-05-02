export interface PromptVariables {
  content_type: string;
  target_audience: string;
  stated_purpose: string;
  content_style_profile: Record<string, unknown>;
  intended_outcome: string;
}

export interface PromptObject {
  template: string;
  variables: PromptVariables;
}
