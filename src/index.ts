import { ConfigManager } from "@src/config/ConfigManager.js";
import * as utils from "@src/utils/index.js";
import { ConfigParser } from "@src/config/ConfigParser.js";

const configDir = process.env.CONFIG_DIR || "./config";
const defaultConfPath = process.env.DEFAULT_CONF_PATH || `${configDir}/default.conf`;
const mainConfPath = process.env.MAIN_CONF_PATH || `${configDir}/main.conf`;
const templateConfPath = process.env.TEMPLATE_CONF_PATH || `${configDir}/template.conf`;

/**
 * Global instance of `ConfigManager`
 *
 * This instance is initialized with default, main, and template configuration paths.
 * The paths can be customized through environment variables for increased flexibility.
 *
 * Configuration loading behavior:
 * - The `default.conf` is loaded first to provide default values.
 * - The `main.conf` is loaded next, overriding values in `default.conf`.
 * - If `main.conf` does not exist, it is created from `template.conf` or `default.conf` (if available).
 *
 * Customization of paths via environment variables:
 * - `CONFIG_DIR`: Base directory for configuration files.
 * - `DEFAULT_CONF_PATH`: Path to the default configuration file.
 * - `MAIN_CONF_PATH`: Path to the main configuration file.
 * - `TEMPLATE_CONF_PATH`: Path to the template configuration file.
 *
 * Usage:
 * ```typescript
 * import { globalConfigManager } from "easy-conf-manager";
 *
 * (async () => {
 *   // Get a configuration value
 *   console.log(await globalConfigManager.get("database.port"));
 *
 *   // Set a new configuration value with a comment
 *   await globalConfigManager.set("server.timeout", 30, "Server timeout in seconds");
 *
 *   // Retrieve comments for a configuration key
 *   console.log(await globalConfigManager.getComment("server.timeout"));
 * })();
 * ```
 *
 * @type {ConfigManager}
 */
const globalConfigManager = new ConfigManager(
  configDir,          // Base directory
  defaultConfPath,    // Default configuration path
  mainConfPath,       // Main configuration path
  templateConfPath    // Template configuration path
);

export { globalConfigManager, utils, ConfigManager, ConfigParser };
export * from "@src/types/index.js";
