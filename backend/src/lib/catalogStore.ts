import { promises as fs } from "fs";
import path from "path";
import { CatalogCategory } from "../types";

const DATA_DIR = path.join(process.cwd(), "data");
const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");

interface CatalogFileData {
  categories: CatalogCategory[];
  updatedAt: string;
}

async function ensureCatalogFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(CATALOG_FILE);
  } catch {
    const initial: CatalogFileData = {
      categories: [],
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(CATALOG_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export async function readCatalog(): Promise<CatalogCategory[]> {
  await ensureCatalogFile();
  const raw = await fs.readFile(CATALOG_FILE, "utf-8");

  let parsed: CatalogFileData;
  try {
    parsed = JSON.parse(raw) as CatalogFileData;
  } catch {
    throw new Error("Invalid catalog data file");
  }

  if (!Array.isArray(parsed.categories)) {
    throw new Error("Catalog data is malformed");
  }

  return parsed.categories;
}

export async function writeCatalog(categories: CatalogCategory[]): Promise<void> {
  await ensureCatalogFile();
  const payload: CatalogFileData = {
    categories,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(CATALOG_FILE, JSON.stringify(payload, null, 2), "utf-8");
}
