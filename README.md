# easy-conf-manager

A lightweight and easy-to-use configuration manager.

[![NPM Version](https://img.shields.io/npm/v/easy-conf-manager.svg?style=flat)](https://www.npmjs.com/package/easy-conf-manager)
[![Beta Version](https://img.shields.io/npm/v/easy-conf-manager/beta.svg?label=beta&color=orange)](https://www.npmjs.com/package/easy-conf-manager/v/beta)
[![NPM Downloads](https://img.shields.io/npm/dt/easy-conf-manager.svg?style=flat)](https://www.npmjs.com/package/easy-conf-manager)
[![Build Status](https://github.com/unterdrueckt/easy-conf-manager/actions/workflows/release.yml/badge.svg)](https://github.com/unterdrueckt/easy-conf-manager/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Features

- **Environment-Based Configuration**: Configurable paths using environment variables (`CONFIG_DIR`, `DEFAULT_CONF_PATH`, `MAIN_CONF_PATH`, `TEMPLATE_CONF_PATH`).
- **Human-Readable Config Files**: Uses a configuration file format inspired by TOML.
- **Dynamic Comment Support**: Programmatically add and manage comments associated with specific keys or sections.
- **Default and Template Files**: Supports merging values from `default.conf` and `template.conf` into `main.conf`.
- **Dynamic Key Management**: Easily add and manage custom keys to adapt to evolving application needs.
- **Full TypeScript Support**: Written in TypeScript, ensuring type safety and better developer experience.
- **Modular and Extensible**: Clear separation of responsibilities in its structure, making it easy to extend.

---

## 📦 Installation

### Stable Version

For the stable release:

```bash
npm install easy-conf-manager
```

### Beta Version

For the beta release:

```bash
npm install easy-conf-manager@beta
```

---

## 🛠️ Usage

### Basic Examples

You will always need this at the top of your project file

```typescript
import { globalConfigManager } from "easy-conf-manager";
```

#### Set a Configuration Value with a Comment

```typescript
// Set a configuration value with a comment using .then for promise handling
globalConfigManager
  .set("AppSettings.apiKey", "your-api-key", "API key for external service")
  .then(() => {
    console.log("Configuration saved!");
  })
  .catch((error) => {
    console.error("Failed to set configuration:", error);
  });
```

or

```typescript
(async () => {
  // Set a configuration value with a comment in a async function
  globalConfigManager.set("AppSettings.apiKey", "your-api-key", "API key for external service");
})
```

After running this code, the `main.conf` file in `/config` would look like this:

```toml
[AppSettings]
# API key for external service
apiKey = "your-api-key"
```

#### Retrieve the Saved Value

```typescript
// Get a configuration value
const apiKey = globalConfigManager.get("AppSettings.apiKey");
console.log(`API Key: "${apiKey}"`);

// Retrieve comments for a specific key
const comments = globalConfigManager.getComment("AppSettings.apiKey");
console.log("Comments:", comments);
```

When you run this code, you’ll see this output:

```console
API Key: "your-api-key"
Comments: [ 'API key for external service' ]
```

---

### Advanced Configuration and Usage

To provide default values use a `default.conf` file in the `/config` directory in the same style as the `main.conf`

If `main.conf` is missing, `easy-conf-manager` will create it by merging values from `default.conf` or `template.conf` (if available).

#### Configuration Paths

`easy-conf-manager` uses environment variables to specify configuration paths. The following environment variables can be used:

- **`CONFIG_DIR`**: Base directory for configuration files. Defaults to `./config`.
- **`DEFAULT_CONF_PATH`**: Path to the default configuration file. Defaults to `${CONFIG_DIR}/default.conf`.
- **`MAIN_CONF_PATH`**: Path to the main configuration file. Defaults to `${CONFIG_DIR}/main.conf`.
- **`TEMPLATE_CONF_PATH`**: Path to the template configuration file. Defaults to `${CONFIG_DIR}/template.conf`.

If environment variables are not provided, the default paths are used.

---

## API Reference

### GET

```typescript
get(key?: string): any | undefined
```

Retrieves a configuration value or section. Returns `undefined` if the key or section does not exist.

- **`key`**: The key to retrieve in `section.subkey` format. If omitted, returns the entire configuration.

---

### GET COMMENT

```typescript
getComment(key: string): string[] | undefined
```

Retrieves comments associated with a specific key or section.

- **`key`**: The key or section to retrieve comments for.

---

### SET

```typescript
await set(key: string, value: any, comment?: string | string[]): Promise<void>
```

Sets a value for a specific key with a optional comment in the configuration file. This method is asynchronous, so you need to await its execution or handle the returned promise.

- **`key`**: The configuration key in `section.subkey` format (e.g., `AppSettings.apiKey`).
- **`value`**: The value to set.
- **`comment`** (optional): A single comment or an array of comments.

---

## Configuration Files

By default, `easy-conf-manager` looks for the following files in the `/config` directory:

- **`default.conf`**: Contains default values.
- **`main.conf`**: The main configuration file. Created automatically if it doesn’t exist.
- **`template.conf`**: Used as a fallback when creating `main.conf`.

---

## 🌐 Links

- [Beta Branch](https://github.com/unterdrueckt/easy-conf-manager/tree/beta)
- [NPM Package](https://www.npmjs.com/package/easy-conf-manager)
- [Issues](https://github.com/unterdrueckt/easy-conf-manager/issues)
- [Changelog](https://github.com/unterdrueckt/easy-conf-manager/releases)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or a pull request to improve the library.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
