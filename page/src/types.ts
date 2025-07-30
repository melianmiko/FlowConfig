export interface ConfigureFlow {
  checkRequirements(): boolean;
  setConfig(language: string): boolean;
}

export interface FlowConfig {
  fileLocation: string;
  version: string;
  language: string;
  voice: string;
}

export interface FlowConfigWithPatcher extends FlowConfig {
  patcher: ConfigureFlow,
}

export interface FlowJsonConfig {
  flowLanguageCodeZone: string;
  audioGender: string;
}
