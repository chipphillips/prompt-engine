export interface PromptVariables {
  [key: string]: string | number | boolean | Record<string, any>;
}

export interface PromptObject {
  template: string;
  variables: PromptVariables;
}

export interface StyleProfile {
  id: string;
  name: string;
  json_payload: Record<string, unknown>;
}
