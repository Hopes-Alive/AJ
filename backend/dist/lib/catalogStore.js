"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCatalog = readCatalog;
exports.writeCatalog = writeCatalog;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(process.cwd(), "data");
const CATALOG_FILE = path_1.default.join(DATA_DIR, "catalog.json");
async function ensureCatalogFile() {
    await fs_1.promises.mkdir(DATA_DIR, { recursive: true });
    try {
        await fs_1.promises.access(CATALOG_FILE);
    }
    catch {
        const initial = {
            categories: [],
            updatedAt: new Date().toISOString(),
        };
        await fs_1.promises.writeFile(CATALOG_FILE, JSON.stringify(initial, null, 2), "utf-8");
    }
}
async function readCatalog() {
    await ensureCatalogFile();
    const raw = await fs_1.promises.readFile(CATALOG_FILE, "utf-8");
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        throw new Error("Invalid catalog data file");
    }
    if (!Array.isArray(parsed.categories)) {
        throw new Error("Catalog data is malformed");
    }
    return parsed.categories;
}
async function writeCatalog(categories) {
    await ensureCatalogFile();
    const payload = {
        categories,
        updatedAt: new Date().toISOString(),
    };
    await fs_1.promises.writeFile(CATALOG_FILE, JSON.stringify(payload, null, 2), "utf-8");
}
//# sourceMappingURL=catalogStore.js.map