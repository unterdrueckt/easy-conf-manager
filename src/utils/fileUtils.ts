import { promises as fs } from "fs";

export async function ensureDirExists(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") throw error;
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function copyFile(sourcePath: string, destPath: string): Promise<void> {
  await fs.copyFile(sourcePath, destPath);
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

export async function writeFile(filePath: string, data: string): Promise<void> {
  await fs.writeFile(filePath, data, "utf-8");
}
