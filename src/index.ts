import { ConfigManager } from "@src/config/ConfigManager.js";
import * as utils from "@src/utils/index.js";
import { ConfigParser } from "@src/config/ConfigParser.js";

/**
 * Global instance of `ConfigManager`
 *
 * This instance is initialized with default, main, and template configuration paths.
 *
 * Configuration loading behavior:
 * - The `default.conf` is loaded first to provide default values.
 * - The `main.conf` is loaded next, overriding values in `default.conf`.
 * - If `main.conf` does not exist, it is created from `template.conf` or `default.conf` (if available).
 *
 * Usage:
 * ```typescript
 * import { globalConfigManager } from "your-config-library";
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
  "./config",
  "./config/default.conf",
  "./config/main.conf",
  "./config/template.conf"
);

export { globalConfigManager, utils, ConfigManager, ConfigParser };
export * from "@src/types/index.js";
