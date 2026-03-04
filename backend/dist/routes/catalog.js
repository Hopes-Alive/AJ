"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const catalogStore_1 = require("../lib/catalogStore");
const router = (0, express_1.Router)();
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
                return true;
            });
        });
    });
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
// PUT /api/catalog — replace full catalogue (admin only)
router.put("/", auth_1.requireAuth, async (req, res) => {
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