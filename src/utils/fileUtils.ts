import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "fs";

/**
 * Ensures the directory exists, creating it if necessary.
 */
export function ensureDirExists(dir: string): void {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") throw error;
  }
}

/**
 * Checks if a file exists.
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Copies a file from source to destination.
 */
export function copyFile(sourcePath: string, destPath: string): void {
  copyFileSync(sourcePath, destPath);
}

/**
 * Reads a file and returns its content as a string.
 */
export function readFile(filePath: string): string {
  return readFileSync(filePath, "utf-8");
}

/**
 * Writes data to a file.
 */
export function writeFile(filePath: string, data: string): void {
  writeFileSync(filePath, data, "utf-8");
}
