import { Router, Request, Response } from "express";
import { requireDeveloper, AuthenticatedRequest } from "../middleware/auth";
import { readCatalog, writeCatalog } from "../lib/catalogStore";
import { ApiResponse, CatalogCategory } from "../types";
import { supabaseAdmin } from "../lib/supabase";
import multer from "multer";
import path from "path";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const CATALOG_BUCKET = process.env.CATALOG_IMAGE_BUCKET || "catalog-images";
let bucketReady = false;

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

function toPublicUrl(storagePath: string): string {
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(CATALOG_BUCKET).getPublicUrl(storagePath);
  return publicUrl;
}

async function ensureCatalogBucket() {
  if (bucketReady) return;
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === CATALOG_BUCKET);
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(CATALOG_BUCKET, {
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

// POST /api/catalog/images/upload — upload a developer-managed product image
router.post(
  "/images/upload",
  requireDeveloper,
  upload.single("image"),
  async (_req: AuthenticatedRequest, res: Response) => {
    const req = _req as AuthenticatedRequest & { file?: Express.Multer.File };
    if (!req.file) {
      const response: ApiResponse = { success: false, error: "Image file is required" };
      res.status(400).json(response);
      return;
    }

    try {
      await ensureCatalogBucket();
      const extension = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
      const safeExt = extension.replace(/[^a-z0-9.]/g, "") || ".jpg";
      const storagePath = `products/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}${safeExt}`;

      const { error } = await supabaseAdmin.storage
        .from(CATALOG_BUCKET)
        .upload(storagePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) {
        const response: ApiResponse = { success: false, error: error.message };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<{ imageUrl: string; storagePath: string }> = {
        success: true,
        data: { imageUrl: toPublicUrl(storagePath), storagePath },
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload image",
      };
      res.status(500).json(response);
    }
  }
);

// DELETE /api/catalog/images — delete a developer-uploaded product image
router.delete("/images", requireDeveloper, async (req: AuthenticatedRequest, res: Response) => {
  const { storagePath } = req.body as { storagePath?: string };
  if (!storagePath || !isString(storagePath)) {
    const response: ApiResponse = { success: false, error: "storagePath is required" };
    res.status(400).json(response);
    return;
  }

  try {
    const { error } = await supabaseAdmin.storage.from(CATALOG_BUCKET).remove([storagePath]);
    if (error) {
      const response: ApiResponse = { success: false, error: error.message };
      res.status(500).json(response);
      return;
    }
    const response: ApiResponse = { success: true, message: "Image deleted" };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
    res.status(500).json(response);
  }
});

// PUT /api/catalog — replace full catalogue (developer only)
router.put("/", requireDeveloper, async (req: AuthenticatedRequest, res: Response) => {
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
