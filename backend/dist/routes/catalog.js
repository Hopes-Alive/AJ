"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const catalogStore_1 = require("../lib/catalogStore");
const supabase_1 = require("../lib/supabase");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const CATALOG_BUCKET = process.env.CATALOG_IMAGE_BUCKET || "catalog-images";
let bucketReady = false;
function isString(value) {
    return typeof value === "string";
}
function validateCatalog(categories) {
    if (!Array.isArray(categories))
        return false;
    return categories.every((category) => {
        if (typeof category !== "object" ||
            category === null ||
            !isString(category.id) ||
            !isString(category.name) ||
            !isString(category.description) ||
            !isString(category.icon) ||
            !Array.isArray(category.groups)) {
            return false;
        }
        return category.groups.every((group) => {
            if (typeof group !== "object" ||
                group === null ||
                !isString(group.id) ||
                !isString(group.name) ||
                !Array.isArray(group.products)) {
                return false;
            }
            return group.products.every((product) => {
                if (typeof product !== "object" || product === null || !isString(product.name)) {
                    return false;
                }
                if (product.imageSource && product.imageSource !== "codebase" && product.imageSource !== "uploaded") {
                    return false;
                }
                if (product.imageStoragePath && !isString(product.imageStoragePath)) {
                    return false;
                }
                return true;
            });
        });
    });
}
function toPublicUrl(storagePath) {
    const { data: { publicUrl }, } = supabase_1.supabaseAdmin.storage.from(CATALOG_BUCKET).getPublicUrl(storagePath);
    return publicUrl;
}
async function ensureCatalogBucket() {
    if (bucketReady)
        return;
    const { data: buckets } = await supabase_1.supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === CATALOG_BUCKET);
    if (!exists) {
        const { error } = await supabase_1.supabaseAdmin.storage.createBucket(CATALOG_BUCKET, {
            public: true,
            fileSizeLimit: "10MB",
        });
        if (error && !error.message.toLowerCase().includes("already")) {
            throw error;
        }
    }
    bucketReady = true;
}
// GET /api/catalog — public catalogue for website and ordering UI
router.get("/", async (_req, res) => {
    try {
        const categories = await (0, catalogStore_1.readCatalog)();
        const response = { success: true, data: categories };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to load catalog",
        };
        res.status(500).json(response);
    }
});
// POST /api/catalog/images/upload — upload a developer-managed product image
router.post("/images/upload", auth_1.requireDeveloper, upload.single("image"), async (_req, res) => {
    const req = _req;
    if (!req.file) {
        const response = { success: false, error: "Image file is required" };
        res.status(400).json(response);
        return;
    }
    try {
        await ensureCatalogBucket();
        const extension = path_1.default.extname(req.file.originalname || "").toLowerCase() || ".jpg";
        const safeExt = extension.replace(/[^a-z0-9.]/g, "") || ".jpg";
        const storagePath = `products/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}${safeExt}`;
        const { error } = await supabase_1.supabaseAdmin.storage
            .from(CATALOG_BUCKET)
            .upload(storagePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
        });
        if (error) {
            const response = { success: false, error: error.message };
            res.status(500).json(response);
            return;
        }
        const response = {
            success: true,
            data: { imageUrl: toPublicUrl(storagePath), storagePath },
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to upload image",
        };
        res.status(500).json(response);
    }
});
// DELETE /api/catalog/images — delete a developer-uploaded product image
router.delete("/images", auth_1.requireDeveloper, async (req, res) => {
    const { storagePath } = req.body;
    if (!storagePath || !isString(storagePath)) {
        const response = { success: false, error: "storagePath is required" };
        res.status(400).json(response);
        return;
    }
    try {
        const { error } = await supabase_1.supabaseAdmin.storage.from(CATALOG_BUCKET).remove([storagePath]);
        if (error) {
            const response = { success: false, error: error.message };
            res.status(500).json(response);
            return;
        }
        const response = { success: true, message: "Image deleted" };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete image",
        };
        res.status(500).json(response);
    }
});
// PUT /api/catalog — replace full catalogue (developer only)
router.put("/", auth_1.requireDeveloper, async (req, res) => {
    const { categories } = req.body;
    if (!validateCatalog(categories)) {
        const response = { success: false, error: "Invalid catalog payload" };
        res.status(400).json(response);
        return;
    }
    try {
        await (0, catalogStore_1.writeCatalog)(categories);
        const response = { success: true, message: "Catalog saved successfully" };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : "Failed to save catalog",
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=catalog.js.map