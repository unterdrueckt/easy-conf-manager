import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  statSync,
  promises
} from "fs";

/**
 * Ensures the specified directory exists. Creates the directory if it does not exist.
 *
 * @param dir - The path of the directory to ensure.
 */
export function ensureDirExists(dir: string): void {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") throw error;
  }
}

/**
 * Checks whether a file exists at the given path.
 *
 * @param filePath - The path of the file to check.
 * @returns `true` if the file exists, otherwise `false`.
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Determines whether a file is empty.
 *
 * @param filePath - The path of the file to check.
 * @returns `true` if the file is empty, otherwise `false`. If the file does not exist or cannot be accessed, it returns `false`.
 */
export function isFileEmpty(filePath: string): boolean {
  try {
    const stats = statSync(filePath);
    return stats.size === 0;
  } catch {
    return false;
  }
}

/**
 * Creates an empty file at the specified path.
 *
 * @param filePath - The path where the empty file will be created.
 */
export function createEmptyFile(filePath: string): void {
  writeFileSync(filePath, "", "utf-8");
}

/**
 * Copies a file from the source path to the destination path.
 *
 * @param sourcePath - The path of the source file.
 * @param destPath - The path of the destination file.
 */
export function copyFile(sourcePath: string, destPath: string): void {
  copyFileSync(sourcePath, destPath);
}

/**
 * Reads the contents of a file and returns it as a string.
 *
 * @param filePath - The path of the file to read.
 * @returns The contents of the file as a string.
 */
export function readFile(filePath: string): string {
  return readFileSync(filePath, "utf-8");
}

/**
 * Writes the provided data to a file at the specified path.
 *
 * @param filePath - The path of the file where data will be written.
 * @param data - The content to write to the file.
 */
export function writeFile(filePath: string, data: string): void {
  writeFileSync(filePath, data, "utf-8");
}

/**
 * Writes the provided data to a file asynchronously at the specified path.
 * 
 * @param filePath - The path of the file where data will be written.
 * @param data - The content to write to the file.
 * @returns A promise that resolves when the file has been written.
 */
export async function writeFileAsync(filePath: string, data: string): Promise<void> {
  await promises.writeFile(filePath, data, "utf-8");
}