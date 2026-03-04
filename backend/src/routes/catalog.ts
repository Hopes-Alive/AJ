import { Router, Request, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { readCatalog, writeCatalog } from "../lib/catalogStore";
import { ApiResponse, CatalogCategory } from "../types";

const router = Router();

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function validateCatalog(categories: unknown): categories is CatalogCategory[] {
  if (!Array.isArray(categories)) return false;

  return categories.every((category) => {
    if (
      typeof category !== "object" ||
      category === null ||
      !isString((category as CatalogCategory).id) ||
      !isString((category as CatalogCategory).name) ||
      !isString((category as CatalogCategory).description) ||
      !isString((category as CatalogCategory).icon) ||
      !Array.isArray((category as CatalogCategory).groups)
    ) {
      return false;
    }

    return (category as CatalogCategory).groups.every((group) => {
      if (
        typeof group !== "object" ||
        group === null ||
        !isString(group.id) ||
        !isString(group.name) ||
        !Array.isArray(group.products)
      ) {
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
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await readCatalog();
    const response: ApiResponse<CatalogCategory[]> = { success: true, data: categories };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load catalog",
    };
    res.status(500).json(response);
  }
});

// PUT /api/catalog — replace full catalogue (admin only)
router.put("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { categories } = req.body as { categories?: unknown };

  if (!validateCatalog(categories)) {
    const response: ApiResponse = { success: false, error: "Invalid catalog payload" };
    res.status(400).json(response);
    return;
  }

  try {
    await writeCatalog(categories);
    const response: ApiResponse = { success: true, message: "Catalog saved successfully" };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save catalog",
    };
    res.status(500).json(response);
  }
});

export default router;
