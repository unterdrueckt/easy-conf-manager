import path from "path";
import * as fs from "fs";
import { extend, isObject } from "@src/utils.js";

export type ConfigValue = number | boolean | string | null | undefined;

export interface ConfigSection {
  [key: string]: ConfigValue;
}

export interface Config {
  [section: string]: ConfigSection;
}

export class ConfigManager {
  private _configDir = process.env.CONFIG_DIR || "./config";
  private _defaultConfPath =
    process.env.DEFAULT_CONF_PATH || path.join(this._configDir, "default.conf");
  private defaultConfPathOverwrite = "";
  private _mainConfPath =
    process.env.MAIN_CONF_PATH || path.join(this._configDir, "main.conf");
  private mainConfPathOverwrite = "";
  private _templatePath =
    process.env.TEMPLATE_CONF_PATH ||
    path.join(this._configDir, "template.conf");
  private templatePathOverwrite = "";

  // Getter for configDir to make it reactive
  get configDir(): string {
    return this._configDir;
  }

  // Setter for configDir to update paths when it changes
  private set configDir(newConfigDir: string) {
    this._configDir = newConfigDir;
    this.updatePaths();
  }

  // Getter for defaultConfPath
  private get defaultConfPath(): string {
    return this.defaultConfPathOverwrite || this._defaultConfPath;
  }

  // Setter for defaultConfPath to allow overwriting
  overwriteDefaultConfPath(newPath: string): void {
    this.defaultConfPathOverwrite = newPath;
  }

  // Getter for mainConfPath
  get mainConfPath(): string {
    return this.mainConfPathOverwrite || this._mainConfPath;
  }

  // Setter for mainConfPath to allow overwriting
  overwriteMainConfPath(newPath: string): void {
    this._mainConfPath = newPath;
  }

  // Getter for templatePath
  get templatePath(): string {
    return this.templatePathOverwrite || this._templatePath;
  }

  // Setter for templatePath to allow overwriting
  overwriteTemplatePath(newPath: string): void {
    this.templatePathOverwrite = newPath;
  }

  // Method to update paths when configDir changes
  private updatePaths(): void {
    this._defaultConfPath =
      process.env.DEFAULT_CONF_PATH ||
      path.join(this._configDir, "default.conf");
    this._mainConfPath =
      process.env.MAIN_CONF_PATH || path.join(this._configDir, "main.conf");
    this._templatePath =
      process.env.TEMPLATE_PATH || path.join(this._configDir, "template.conf");
  }

  private config: Config = {};

  constructor(options?: {
    configDir?: string;
    defaultConfPath?: string;
    mainConfPath?: string;
    templatePath?: string;
  }) {
    if (options?.configDir) {
      this._configDir = options.configDir;
      this.updatePaths();
    }
    if (options?.defaultConfPath) {
      this.overwriteDefaultConfPath(options.defaultConfPath);
    }
    if (options?.mainConfPath) {
      this.overwriteMainConfPath(options.mainConfPath);
    }
    if (options?.templatePath) {
      this.overwriteTemplatePath(options.templatePath);
    }
    this.ensureFilesExist();
    this.loadConfig();
  }

  private ensureFilesExist() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir);
    }
    if (!fs.existsSync(this.mainConfPath)) {
      if (fs.existsSync(this.templatePath)) {
        // COPY template.conf to main.conf
        fs.copyFileSync(this.templatePath, this.mainConfPath);
      } else if (fs.existsSync(this.defaultConfPath)) {
        // COPY default.conf to main.conf
        fs.copyFileSync(this.defaultConfPath, this.mainConfPath);
      }
    }
  }

  private getKeyComponents(fullKey: string): { section: string; key: string } {
    const [section, key] = fullKey.split(".");
    return { section, key };
  }

  private convertToType(
    value: string
  ): number | boolean | string | null | undefined {
    // Check if the value is a number (including Infinity)
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
      return Number(value);
    }
    // Check if the value is a boolean
    else if (value === "true" || value === "false") {
      return value === "true";
    }
    // Check if the value is null or undefined
    else if (value === "null") {
      return null;
    } else if (value === "undefined") {
      return undefined;
    }
    // Check if the value is a string with surrounding quotes
    else if (/^"(.*)"$/g.test(value)) {
      return value.slice(1, -1); // Remove quotes
    }
    // Otherwise, treat as a string
    else {
      return value;
    }
  }

  private formatVariable(value: any) {
    if (typeof value === "string") {
      return `"${value}"`;
    } else {
      return value;
    }
  }

  private processFileSync(filePath: string): any {
    const result: any = {}; // TypeScript object to store the extracted data
    let currentVariable: string | null = null;

    if (!fs.existsSync(filePath)) {
      return {};
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const lines = fileContent.split("\n");

      for (const rawLine of lines) {
        const line = rawLine.trim(); // Trim leading and trailing whitespaces

        if (line.startsWith("[")) {
          const startIndex = line.indexOf("[") + 1;
          const endIndex = line.indexOf("]", startIndex);

          if (endIndex !== -1) {
            currentVariable = line.substring(startIndex, endIndex);
          } else {
            throw new Error(
              `Invalid config format - Missing closing bracket "]" on line ${line}`
            );
          }
        } else if (line !== "" && !line.startsWith("#")) {
          // Use a regular expression to split on colons or equal signs, considering quoted strings
          const keyValuePairs = line.match(/("[^"]*"|'[^']*'|[^'"\s:=]+)/g);

          if (keyValuePairs && keyValuePairs.length === 2) {
            const [key, value] = keyValuePairs.map((part) =>
              part.trim().replace(/['"]/g, "")
            );

            if (currentVariable) {
              result[currentVariable] = result[currentVariable] || {};
              result[currentVariable][key] = this.convertToType(value);
            } else {
              throw new Error(
                `Invalid config format - Key-value pair without variable on line ${line}`
              );
            }
          } else {
            throw new Error(
              `Invalid config format - Line ${line} does not match key-value pattern`
            );
          }
        }
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  loadConfig(): void {
    this.config = extend(
      true,
      this.processFileSync(this.defaultConfPath),
      this.processFileSync(this.mainConfPath)
    );
    // TODO: KEY VALUE CHECKS
  }

  /**
   * Checks if a specified key exists in the configuration.
   *
   * @param {string} fullKey - The full key (including section) to check for existence.
   * @returns {boolean} - Returns true if the key exists, otherwise false.
   */
  has(fullKey: string): boolean {
    const { section, key } = this.getKeyComponents(fullKey);
    return this.config[section] && (key ? key in this.config[section] : true);
  }

  /**
   * Gets the value of a specified key or the entire configuration if no key is provided.
   *
   * @param {string} [fullKey] - The full key (including section) to retrieve the value for.
   *                            If not provided, the entire configuration is returned.
   * @returns {ConfigValue | ConfigSection | Config} - The value associated with the specified key or the entire configuration.
   */
  get(fullKey?: string): ConfigValue | ConfigSection | Config {
    if (!fullKey) {
      return this.config;
    }
    const { section, key } = this.getKeyComponents(fullKey);
    return key ? this.config[section]?.[key] : this.config[section];
  }

  /**
   * Sets the value for a specified key in the configuration.
   * If the key or section does not exist, it adds a new entry to the configuration.
   *
   * @param {string} fullKey - The full key (including section) to set the value for.
   * @param {ConfigValue} value - The value to set for the specified key.
   * @param {string | string[]} [comment] - Optional comment(s) to add to the configuration file.
   */
  set(fullKey: string, value: ConfigValue, comment?: string | string[]): void {
    const { section, key } = this.getKeyComponents(fullKey);

    if (!fs.existsSync(this.mainConfPath)) {
      // If the main file doesn't exist, create it
      let lines: Array<string> = [];
      lines.push(`[${section}]\r`);
      if (comment) {
        const commentLines = Array.isArray(comment) ? comment : [comment];
        lines.push(...commentLines.map((c) => `# ${c}\r`)); // Add the comment
      }
      lines.push(`${key}=${this.formatVariable(value)}\r`); // Add the key-value pair
      fs.writeFileSync(this.mainConfPath, lines.join("\n"));
      this.loadConfig();
      return;
    }

    const lines = fs
      .readFileSync(this.mainConfPath, "utf-8")
      .split("\n")
      .reverse() // Reverse the array to easily remove from the end
      .filter(
        (line, index, array) =>
          index === 0 || line.trim() !== "" || array[index - 1].trim() !== ""
      )
      .reverse(); // Reverse it back to the original order

    let currentSection: string | null = null;
    let previusSectionEntry: number | null = null;
    let lastSectionEntry: number | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("[")) {
        const startIndex = line.indexOf("[") + 1;
        const endIndex = line.indexOf("]", startIndex);

        if (endIndex !== -1) {
          currentSection = line.substring(startIndex, endIndex);
        } else {
          console.error(
            `Invalid config format - Missing closing bracket "]" on line ${line}`
          );
        }
      } else if (currentSection == section) {
        if (line === "") {
          if (lastSectionEntry != previusSectionEntry) {
            lastSectionEntry = previusSectionEntry;
          }
        } else {
          previusSectionEntry = i;
          const keyMatch = new RegExp(`^(\\s*#)?\\s*${key}[:=]`, "i").test(
            line
          );
          if (keyMatch) {
            lines[i] = `${key}=${this.formatVariable(value)}\r`;
            if (comment) {
              const commentLines = Array.isArray(comment) ? comment : [comment];
              lines.splice(i, 0, ...commentLines.map((c) => `# ${c}\r`));
            }
            fs.writeFileSync(this.mainConfPath, lines.join("\n"));
            this.loadConfig();
            return;
          }
        }
      }
    }

    // Prevent creating new sections if config file is not longer than last key from target section
    if (lastSectionEntry != previusSectionEntry) {
      lastSectionEntry = previusSectionEntry;
    }

    // If the key doesn't exist, add a new entry under the last position in the specified section
    if (lastSectionEntry !== null) {
      lines.splice(
        lastSectionEntry + 1,
        0,
        `${key}=${this.formatVariable(value)}\r`
      );
      if (comment) {
        const commentLines = Array.isArray(comment) ? comment : [comment];
        lines.splice(
          lastSectionEntry + 1,
          0,
          ...commentLines.map((c) => `# ${c}\r`)
        );
      }
      fs.writeFileSync(this.mainConfPath, lines.join("\n"));
      this.loadConfig();
      return;
    }

    // If the section doesn't exist, append a new entry at the end of the file
    lines.push("");
    lines.push(`[${section}]\r`);
    if (comment) {
      const commentLines = Array.isArray(comment) ? comment : [comment];
      lines.push(...commentLines.map((c) => `# ${c}\r`)); // Add the comment
    }
    lines.push(`${key}=${this.formatVariable(value)}\r`); // Add the key-value pair
    fs.writeFileSync(this.mainConfPath, lines.join("\n"));
    this.loadConfig();
    return;
  }
}

const globalConfigManager = new ConfigManager();

const utils = { extend, isObject };

export default globalConfigManager;
export { utils };
