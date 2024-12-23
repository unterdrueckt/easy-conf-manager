# easy-conf-manager

A lightweight and easy-to-use configuration manager.

[![NPM Version](https://img.shields.io/npm/v/easy-conf-manager.svg?style=flat)](https://www.npmjs.com/package/easy-conf-manager)
[![Beta Version](https://img.shields.io/npm/v/easy-conf-manager/beta.svg?label=beta&color=orange)](https://www.npmjs.com/package/easy-conf-manager/v/beta)
[![NPM Downloads](https://img.shields.io/npm/dt/easy-conf-manager.svg?style=flat)](https://www.npmjs.com/package/easy-conf-manager)
[![Build Status](https://github.com/unterdrueckt/easy-conf-manager/actions/workflows/release.yml/badge.svg)](https://github.com/unterdrueckt/easy-conf-manager/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ⚠️ Below Is for v1.1.0
The following features and documentation refer to the stable release **v1.1.0**.

If you want to explore the **new features in `2.0.0-beta`**, visit the [beta branch documentation](https://github.com/unterdrueckt/easy-conf-manager/tree/beta).

---

- **Human-Readable Config File**: Utilize a configuration file format inspired by TOML.
- **Dynamic Comment Support**: Comments in the config file can be added programmatically.
- **Default Values**: Set default values for configuration options, ensuring your application gracefully falls back to predefined settings.
- **Simple API**: Enjoy a straightforward API with methods for effortlessly setting, getting, and managing configuration values.
- **TypeScript Support**: Written in TypeScript, providing full type safety.
- **Dynamic Key Management**: Easily add custom keys and dynamically manage configurations, adapting to your application's evolving needs.

## Installation

Install `easy-conf-manager`:

```bash
npm install easy-conf-manager
```

or

```bash
pnpm add easy-conf-manager
```

## Usage

```typescript
import globalConfigManager from "easy-conf-manager";

// Set a configuration value
globalConfigManager.set("AppSettings.apiKey", "api-key");

// Get a configuration value
const apiKey = globalConfigManager.get("AppSettings.apiKey");
console.log("API Key:", apiKey);

// Modify a configuration value and adding a comment
globalConfigManager.set(
  "AppSettings.apiKey",
  "your-api-key",
  "This is is the setting for your app api key."
);
```

auto generates the `config.conf` file in `/config`:

```toml
[AppSettings]
# This is is the setting for your app api key.
apiKey="your-api-key"
```

### Default Configuration

You can set default values through `default.conf` in `/config`:

```toml
[AppSettings]
appKey="your-default-value"
```

## License

This project is licensed under the MIT License.
