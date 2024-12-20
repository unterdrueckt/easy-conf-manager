import {
  ensureDirExists,
  fileExists,
  copyFile,
  readFile,
  writeFile,
} from "@src/utils/fileUtils.js";
import {
  Config,
  ConfigWithComments,
  ConfigSection,
  ConfigValue,
} from "@src/types/ConfigTypes.js";
import { extend } from "@src/utils/objectUtils.js";
import { ConfigParser } from "@src/config/ConfigParser.js";

export class ConfigManager {
  private configData: ConfigWithComments = { config: {}, comments: {} };

  constructor(
    private configDir: string,
    private defaultConfPath: string,
    private mainConfPath: string,
    private templateConfPath?: string,
    autoInit: boolean = true
  ) {
    if (autoInit) {
      this.init();
    }
  }

  /**
   * Initializes the configuration manager by ensuring files exist and loading the configuration.
   */
  init(): void {
    ensureDirExists(this.configDir);
    this.ensureMainConfExists();
    this.loadConfig();
  }

  private ensureMainConfExists(): void {
    if (!fileExists(this.mainConfPath)) {
      if (this.templateConfPath && fileExists(this.templateConfPath)) {
        copyFile(this.templateConfPath, this.mainConfPath);
      } else if (fileExists(this.defaultConfPath)) {
        copyFile(this.defaultConfPath, this.mainConfPath);
      }
    }
  }

  private loadConfig(): void {
    const defaultConfigData = fileExists(this.defaultConfPath)
      ? ConfigParser.parse(readFile(this.defaultConfPath))
      : { config: {}, comments: {} };

    const mainConfigData = fileExists(this.mainConfPath)
      ? ConfigParser.parse(readFile(this.mainConfPath))
      : { config: {}, comments: {} };

    this.configData = {
      config: extend(true, defaultConfigData.config, mainConfigData.config),
      comments: { ...defaultConfigData.comments, ...mainConfigData.comments },
    };
  }

  /**
   * Retrieves the value of a specific key, section, or the entire configuration with comments.
   *
   * @param {string} [key] - The key to retrieve in the format "section.subkey".
   *                         If not provided, returns the entire configuration with comments.
   * @returns {ConfigValue | ConfigSection | ConfigWithComments | undefined} - The requested configuration data or undefined if not found.
   */
  get(
    key?: string
  ): ConfigValue | ConfigSection | ConfigWithComments | undefined {
    if (!key) return this.configData;

    const [section, subkey] = key.split(".");
    if (!section) return undefined;

    if (subkey) {
      return this.configData.config[section]?.[subkey];
    } else {
      return this.configData.config[section] ?? undefined;
    }
  }

  /**
   * Retrieves the comments associated with a specific key or section.
   *
   * @param {string} key - The key or section to retrieve comments for.
   * @returns {string[] | undefined} - The comments associated with the specified key or section.
   */
  getComment(key: string): string[] | undefined {
    return this.configData.comments[key];
  }

  /**
   * Sets the value of a specific key, adding comments if provided.
   *
   * @param {string} key - The key to set in the format "section.subkey".
   * @param {any} value - The value to set for the specified key.
   * @param {string | string[]} [comment] - Optional comment(s) to associate with the key.
   * @throws {Error} If the key is not in a valid "section.subkey" format.
   */
  async set(
    key: string,
    value: any,
    comment?: string | string[]
  ): Promise<void> {
    const [section, subkey] = key.split(".");
    if (!section || !subkey) {
      throw new Error(
        `Invalid key format: "${key}". Expected format is "section.subkey".`
      );
    }

    if (!this.configData.config[section]) {
      this.configData.config[section] = {};
    }

    this.configData.config[section][subkey] = value;

    if (comment) {
      const commentKey = `${section}.${subkey}`;
      this.configData.comments[commentKey] = Array.isArray(comment)
        ? comment
        : [comment];
    }

    const serialized = ConfigParser.stringify(this.configData);
    await writeFile(this.mainConfPath, serialized);
  }
}
