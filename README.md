# easy-conf-manager

A lightweight, asynchronous, and feature-rich configuration manager for modern applications.

[![NPM Version](https://img.shields.io/npm/v/easy-conf-manager.svg?style=flat)](https://www.npmjs.com/package/easy-conf-manager)
[![NPM Downloads](https://img.shields.io/npm/dt/easy-conf-manager.svg?style=flat)](https://www.npmjs.com/package/easy-conf-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Asynchronous API**: Non-blocking methods for optimal performance.
- **Human-Readable Config Files**: Uses a configuration file format inspired by TOML.
- **Dynamic Comment Support**: Programmatically add and manage comments associated with specific keys or sections.
- **Default and Template Files**: Supports merging values from `default.conf` and `template.conf` into `main.conf`.
- **Dynamic Key Management**: Easily add and manage custom keys to adapt to evolving application needs.
- **Full TypeScript Support**: Written in TypeScript, ensuring type safety and better developer experience.
- **Modular and Extensible**: Clear separation of responsibilities in its structure, making it easy to extend.

---

## Installation

Install `easy-conf-manager`:

```bash
npm install easy-conf-manager
```

or

```bash
pnpm add easy-conf-manager
```

---

## Usage

### Basic Example

```typescript
import { globalConfigManager } from "easy-conf-manager";

(async () => {
  // Set a configuration value with a comment
  await globalConfigManager.set("AppSettings.apiKey", "your-api-key", "API key for external service");

  // Get a configuration value
  const apiKey = await globalConfigManager.get("AppSettings.apiKey");
  console.log("API Key:", apiKey);

  // Retrieve comments for a specific key
  const comments = await globalConfigManager.getComment("AppSettings.apiKey");
  console.log("Comments:", comments);
})();
```

After running this code, the `main.conf` file in `/config` would look like this:

```toml
[AppSettings]
# API key for external service
apiKey="your-api-key"
```

---

### Default Configuration

You can provide default values using a `default.conf` file in the `/config` directory:

```toml
[AppSettings]
apiKey="default-api-key"
```

If `main.conf` is missing, `easy-conf-manager` will create it by merging values from `default.conf` and `template.conf` (if available).

---

### Advanced Features

#### Comments Management

Easily add and retrieve comments programmatically:
```typescript
await globalConfigManager.set("Database.port", 5432, "Port for database connection");
const portComment = await globalConfigManager.getComment("Database.port");
console.log("Comment for Database.port:", portComment);
```

---

## API Reference

### GET

```ts
get(key?: string): Promise<any>
```

Retrieves a configuration value or section.

- **`key`**: The key to retrieve in `section.subkey` format. If omitted, returns the entire configuration.

### GET COMMENT

```ts
getComment(key: string): Promise<string[] | undefined>
```

Retrieves comments associated with a specific key or section.

- **`key`**: The key or section to retrieve comments for.

### SET

```ts
set(key: string, value: any, comment?: string | string[]): Promise<void>
```

Sets a value for a specific key. Optionally adds a comment.

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

## License

This project is licensed under the MIT License.