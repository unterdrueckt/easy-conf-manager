# easy-conf-manager

[![npm version](https://badge.fury.io/js/easy-conf-manager.svg)](https://badge.fury.io/js/easy-conf-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/your-username/easy-conf-manager.svg?branch=main)](https://travis-ci.org/your-username/easy-conf-manager)


`easy-conf-manager` is a lightweight and easy-to-use configuration manager for Node.js applications written in TypeScript. It provides a simple interface for managing configuration files, making it easy use in your projects.

## Features

- **Human-Readable Config File**: Utilize a configuration file format inspired by TOML.
- **Dynamic Comment Support**: Comments in the config file can be added programmatically.
- **Default Values**: Set default values for configuration options, ensuring your application gracefully falls back to predefined settings.
- **Simple API**: Enjoy a straightforward API with methods for effortlessly setting, getting, and managing configuration values.
- **TypeScript Support**: Written in TypeScript, providing full type safety.
- **Dynamic Key Management**: Easily add custom keys and dynamically manage configurations, adapting to your application's evolving needs.

## Table of Contents

- [Installation](#installation)
- [Simple Usage](#simple-usage)
- [Default Configuration](#default-configuration)
- [License](#license)

## Installation

Install `easy-conf-manager`:

```bash
npm install easy-conf-manager
```

or

```bash
pnpm add easy-conf-manager
```

## Simple Usage

```typescript
import globalConfigManager from 'easy-conf-manager';

// Set a configuration value
globalConfigManager.set('AppSettings.apiKey', 'api-key');

// Get a configuration value
const apiKey = globalConfigManager.get('AppSettings.apiKey');
console.log('API Key:', apiKey);

// Modify a configuration value and adding a comment
globalConfigManager.set('AppSettings.apiKey', 'your-api-key', 'This is is the setting for your app api key.');
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