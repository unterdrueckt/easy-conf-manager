import { ensureDirExists, fileExists, copyFile, readFile, writeFile } from "@src/utils/fileUtils.js";
import {Config, ConfigWithComments, ConfigSection, ConfigValue } from "@src/types/ConfigTypes.js";
import { extend } from "@src/utils/objectUtils.js";
import { ConfigParser } from "@src/config/ConfigParser.js";

export class ConfigManager {
  private configData: ConfigWithComments = { config: {}, comments: {} };
  private initPromise: Promise<void>;

  constructor(
    private configDir: string,
    private defaultConfPath: string,
    private mainConfPath: string,
    private templateConfPath?: string,
    autoInit: boolean = true
  ) {
    if (autoInit) {
      this.initPromise = this.init();
    } else {
      this.initPromise = Promise.resolve();
    }
  }

  /**
   * Initializes the configuration manager by ensuring files exist and loading the configuration.
   */
  async init(): Promise<void> {
    await ensureDirExists(this.configDir);
    await this.ensureMainConfExists();
    await this.loadConfig();
  }

  private async ensureInitialized(): Promise<void> {
    await this.initPromise;
  }

  private async ensureMainConfExists(): Promise<void> {
    if (!(await fileExists(this.mainConfPath))) {
      if (this.templateConfPath && (await fileExists(this.templateConfPath))) {
        await copyFile(this.templateConfPath, this.mainConfPath);
      } else if (await fileExists(this.defaultConfPath)) {
        await copyFile(this.defaultConfPath, this.mainConfPath);
      }
    }
  }

  private async loadConfig(): Promise<void> {
    const defaultConfigData = (await fileExists(this.defaultConfPath))
      ? ConfigParser.parse(await readFile(this.defaultConfPath))
      : { config: {}, comments: {} };

    const mainConfigData = (await fileExists(this.mainConfPath))
      ? ConfigParser.parse(await readFile(this.mainConfPath))
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
   * @returns {Promise<ConfigValue | ConfigSection | ConfigWithComments>} - The requested configuration data.
   */
  async get(key?: string): Promise<ConfigValue | ConfigSection | ConfigWithComments> {
    await this.ensureInitialized();
    if (!key) return this.configData;

    const [section, subkey] = key.split(".");
    return subkey
      ? this.configData.config[section]?.[subkey]
      : this.configData.config[section];
  }

  /**
   * Retrieves the comments associated with a specific key or section.
   *
   * @param {string} key - The key or section to retrieve comments for.
   * @returns {Promise<string[] | undefined>} - The comments associated with the specified key or section.
   */
  async getComment(key: string): Promise<string[] | undefined> {
    await this.ensureInitialized();
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
  async set(key: string, value: any, comment?: string | string[] ): Promise<void> {
    await this.ensureInitialized();

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
