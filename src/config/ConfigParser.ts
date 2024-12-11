import { Config, ConfigWithComments } from "@src/types/ConfigTypes.js";

export class ConfigParser {
  static parse(content: string): ConfigWithComments {
    const config: Config = {};
    const comments: Record<string, string[]> = {};
    let currentSection: string | null = null;
    let currentKey: string | null = null;

    const lines = content.split("\n");
    let commentBuffer: string[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (line.startsWith("#") || line.startsWith(";")) {
        commentBuffer.push(line.substring(1).trim());
      } else if (line.startsWith("[") && line.endsWith("]")) {
        currentSection = line.slice(1, -1);
        config[currentSection] = {};
        if (commentBuffer.length > 0) {
          comments[currentSection] = [...commentBuffer];
          commentBuffer = [];
        }
      } else if (line) {
        const [key, value] = line.split("=").map((item) => item.trim());
        if (currentSection && key) {
          currentKey = `${currentSection}.${key}`;
          config[currentSection][key] = this.convertToType(value);
          if (commentBuffer.length > 0) {
            comments[currentKey] = [...commentBuffer];
            commentBuffer = [];
          }
        }
      }
    }

    return { config, comments };
  }

  static stringify(data: ConfigWithComments): string {
    const { config, comments } = data;

    return Object.entries(config)
      .map(([section, entries]) => {
        const sectionComments = comments[section] || [];
        const sectionHeader = `[${section}]`;
        const sectionBody = Object.entries(entries)
          .map(([key, value]) => {
            const keyComments = comments[`${section}.${key}`] || [];
            const formattedComments = keyComments
              .map((c) => `# ${c}`)
              .join("\n");
            return `${formattedComments}\n${key}=${value}`;
          })
          .join("\n");

        const formattedSectionComments = sectionComments
          .map((c) => `# ${c}`)
          .join("\n");

        return `${formattedSectionComments}\n${sectionHeader}\n${sectionBody}`;
      })
      .join("\n\n");
  }

  private static convertToType(value: string): any {
    if (!isNaN(Number(value))) return Number(value);
    if (value === "true" || value === "false") return value === "true";
    if (["null", "undefined"].includes(value)) return null;
    return value.replace(/^"(.*)"$/, "$1");
  }
}
