export type ConfigValue = number | boolean | string | null | undefined;

export interface ConfigSection {
  [key: string]: ConfigValue;
}

export interface Config {
  [section: string]: ConfigSection;
}

export interface ConfigWithComments {
  config: Config;
  comments: Record<string, string[]>;
}