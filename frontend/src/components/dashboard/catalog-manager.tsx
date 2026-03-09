"use client";

import { useEffect, useMemo, useState } from "react";
import { Category } from "@/types";
import { categories as fallbackCategories } from "@/data/products";
import {
  deleteCatalogImage,
  getCatalog,
  saveCatalog,
  uploadCatalogImage,
} from "@/lib/api/catalog";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Upload,
  ImageMinus,
  FileText,
} from "lucide-react";

function deepCloneCategories(source: Category[]): Category[] {
  return JSON.parse(JSON.stringify(source)) as Category[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface ProductPageEntry {
  id: string;
  categoryName: string;
  groupName: string;
  features?: string;
  name: string;
  pack: string;
  price: string;
  image?: string;
}

interface PdfProductPage {
  pageNumber: number;
  totalPages: number;
  entries: ProductPageEntry[];
}

function chunkItems<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

export function CatalogManager() {
  const [activeTab, setActiveTab] = useState<"catalog" | "pdf">("catalog");
  const [catalog, setCatalog] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [activeGroupId, setActiveGroupId] = useState<string>("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const fromApi = await getCatalog();
        const initial =
          fromApi.length > 0
            ? deepCloneCategories(fromApi)
            : deepCloneCategories(fallbackCategories);
        setCatalog(initial);
        setActiveCategoryId(initial[0]?.id ?? "");
        setActiveGroupId(initial[0]?.groups[0]?.id ?? "");
      } catch {
        const initial = deepCloneCategories(fallbackCategories);
        setCatalog(initial);
        setActiveCategoryId(initial[0]?.id ?? "");
        setActiveGroupId(initial[0]?.groups[0]?.id ?? "");
        setError("Could not load saved catalog. Using local fallback data.");
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const activeCategory = useMemo(
    () => catalog.find((c) => c.id === activeCategoryId),
    [catalog, activeCategoryId]
  );

  const activeGroup = useMemo(
    () => activeCategory?.groups.find((g) => g.id === activeGroupId),
    [activeCategory, activeGroupId]
  );

  function updateCategory(update: (cat: Category) => Category) {
    if (!activeCategory) return;
    setCatalog((prev) =>
      prev.map((cat) => (cat.id === activeCategory.id ? update(cat) : cat))
    );
  }

  function addCategory() {
    const id = `category-${Date.now()}`;
    const next: Category = {
      id,
      name: "New Category",
      description: "",
      icon: "package",
      groups: [],
    };
    setCatalog((prev) => [...prev, next]);
    setActiveCategoryId(id);
    setActiveGroupId("");
  }

  function removeCategory() {
    if (!activeCategory) return;
    setCatalog((prev) => prev.filter((cat) => cat.id !== activeCategory.id));
    const remaining = catalog.filter((cat) => cat.id !== activeCategory.id);
    setActiveCategoryId(remaining[0]?.id ?? "");
    setActiveGroupId(remaining[0]?.groups[0]?.id ?? "");
  }

  function addGroup() {
    if (!activeCategory) return;
    const newGroupId = `group-${Date.now()}`;
    updateCategory((cat) => ({
      ...cat,
      groups: [
        ...cat.groups,
        {
          id: newGroupId,
          name: "New Sub Category",
          features: "",
          defaultPack: "",
          defaultPrice: "",
          products: [],
        },
      ],
    }));
    setActiveGroupId(newGroupId);
  }

  function removeGroup(groupId: string) {
    if (!activeCategory) return;
    updateCategory((cat) => ({
      ...cat,
      groups: cat.groups.filter((g) => g.id !== groupId),
    }));
    const remaining = activeCategory.groups.filter((g) => g.id !== groupId);
    setActiveGroupId(remaining[0]?.id ?? "");
  }

  function updateGroupField(groupId: string, field: string, value: string) {
    updateCategory((cat) => ({
      ...cat,
      groups: cat.groups.map((g) =>
        g.id === groupId ? { ...g, [field]: value } : g
      ),
    }));
  }

  function addProduct() {
    if (!activeGroup) return;
    updateCategory((cat) => ({
      ...cat,
      groups: cat.groups.map((g) =>
        g.id === activeGroup.id
          ? {
              ...g,
              products: [
                ...g.products,
                { name: "New Product", pack: "", price: "", image: "" },
              ],
            }
          : g
      ),
    }));
  }

  function removeProduct(index: number) {
    if (!activeGroup) return;
    updateCategory((cat) => ({
      ...cat,
      groups: cat.groups.map((g) =>
        g.id === activeGroup.id
          ? { ...g, products: g.products.filter((_, i) => i !== index) }
          : g
      ),
    }));
  }

  function updateProductField(index: number, field: string, value: string) {
    if (!activeGroup) return;
    updateCategory((cat) => ({
      ...cat,
      groups: cat.groups.map((g) =>
        g.id === activeGroup.id
          ? {
              ...g,
              products: g.products.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
              ),
            }
          : g
      ),
    }));
  }

  function getProductKey(index: number): string | null {
    if (!activeCategory || !activeGroup) return null;
    return `${activeCategory.id}:${activeGroup.id}:${index}`;
  }

  function isCodebaseImage(image?: string): boolean {
    return Boolean(image && image.startsWith("/images/"));
  }

  async function handleUploadProductImage(index: number, file: File) {
    if (!activeGroup) return;
    const key = getProductKey(index);
    if (!key) return;

    setUploadingImageKey(key);
    setError(null);
    setMessage(null);

    try {
      const uploaded = await uploadCatalogImage(file);
      updateCategory((cat) => ({
        ...cat,
        groups: cat.groups.map((g) =>
          g.id === activeGroup.id
            ? {
                ...g,
                products: g.products.map((p, i) =>
                  i === index
                    ? {
                        ...p,
                        image: uploaded.imageUrl,
                        imageSource: "uploaded",
                        imageStoragePath: uploaded.storagePath,
                      }
                    : p
                ),
              }
            : g
        ),
      }));
      setMessage("Image uploaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImageKey(null);
    }
  }

  async function handleDeleteProductImage(index: number) {
    if (!activeGroup) return;
    const product = activeGroup.products[index];
    if (!product?.image) return;

    setError(null);
    setMessage(null);

    try {
      if (product.imageSource === "uploaded" && product.imageStoragePath) {
        await deleteCatalogImage(product.imageStoragePath);
      }

      updateCategory((cat) => ({
        ...cat,
        groups: cat.groups.map((g) =>
          g.id === activeGroup.id
            ? {
                ...g,
                products: g.products.map((p, i) =>
                  i === index
                    ? {
                        ...p,
                        image: "",
                        imageSource: undefined,
                        imageStoragePath: undefined,
                      }
                    : p
                ),
              }
            : g
        ),
      }));

      setMessage(
        product.imageSource === "uploaded"
          ? "Uploaded image deleted from storage."
          : "Codebase image reference removed from catalog."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await saveCatalog(catalog);
      setMessage("Catalog saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save catalog");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border p-8 flex items-center justify-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading catalog...</span>
      </div>
    );
  }

  const websiteUrl = "https://www.ajfreshfood.com.au";
  const websiteLabel = "www.ajfreshfood.com.au";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(websiteUrl)}`;
  const coverCategories = catalog.slice(0, 9);
  const allCategoryNames = catalog
    .map((category) => category.name.trim())
    .filter(Boolean)
    .join(", ");
  const heroCustomImageUrl = "/api/developer/cover-hero";
  const heroPreviewImage = coverCategories[0]
    ? getCategoryPreviewImage(coverCategories[0])
    : null;
  const totalGroups = catalog.reduce((sum, category) => sum + category.groups.length, 0);
  const totalProducts = catalog.reduce(
    (sum, category) =>
      sum + category.groups.reduce((groupTotal, group) => groupTotal + group.products.length, 0),
    0
  );
  const allProductEntries: ProductPageEntry[] = catalog.flatMap((category) =>
    category.groups.flatMap((group) =>
      group.products.map((product, index) => ({
        id: `${category.id}-${group.id}-${index}`,
        categoryName: category.name,
        groupName: group.name,
        features: group.features,
        name: product.name,
        pack: product.pack?.trim() || group.defaultPack?.trim() || "-",
        price: product.price?.trim() || group.defaultPrice?.trim() || "-",
        image: product.image,
      }))
    )
  );
  const productPagesChunks = chunkItems(allProductEntries, 8);
  const productPages: PdfProductPage[] = productPagesChunks.map((entries, index) => ({
    pageNumber: index + 1,
    totalPages: productPagesChunks.length,
    entries,
  }));

  function getCategoryPreviewImage(category: Category): string | null {
    for (const group of category.groups) {
      for (const product of group.products) {
        if (product.image && product.image.trim()) return product.image;
      }
    }
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
              activeTab === "catalog"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Save className="h-4 w-4" />
            Catalog Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pdf")}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
              activeTab === "pdf"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="h-4 w-4" />
            Build PDF
          </button>
        </div>
      </div>

      {activeTab === "catalog" ? (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Categories</h2>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-primary text-primary-foreground"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
            <div className="space-y-1 max-h-[60vh] overflow-auto pr-1">
              {catalog.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setActiveGroupId(cat.groups[0]?.id ?? "");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    cat.id === activeCategoryId
                      ? "bg-primary/15 text-primary font-semibold"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-5">
            {activeCategory ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-lg font-bold">Catalog Manager</h1>
                    <p className="text-sm text-muted-foreground">
                      Manage category, sub category, products and images.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={removeCategory}
                      className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-destructive/30 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Category
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm space-y-1">
                    <span className="text-muted-foreground">Category Name</span>
                    <input
                      value={activeCategory.name}
                      onChange={(e) =>
                        updateCategory((cat) => ({
                          ...cat,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    />
                  </label>
                  <label className="text-sm space-y-1">
                    <span className="text-muted-foreground">Category ID</span>
                    <input
                      value={activeCategory.id}
                      onChange={(e) => {
                        const nextId = slugify(e.target.value);
                        const previousId = activeCategory.id;
                        setCatalog((prev) =>
                          prev.map((cat) =>
                            cat.id === previousId ? { ...cat, id: nextId } : cat
                          )
                        );
                        setActiveCategoryId(nextId);
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    />
                  </label>
                  <label className="text-sm space-y-1 sm:col-span-2">
                    <span className="text-muted-foreground">Description</span>
                    <input
                      value={activeCategory.description}
                      onChange={(e) =>
                        updateCategory((cat) => ({
                          ...cat,
                          description: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    />
                  </label>
                  <label className="text-sm space-y-1">
                    <span className="text-muted-foreground">Icon</span>
                    <input
                      value={activeCategory.icon}
                      onChange={(e) =>
                        updateCategory((cat) => ({
                          ...cat,
                          icon: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Sub Categories</h3>
                    <button
                      type="button"
                      onClick={addGroup}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-border"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Sub Category
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeCategory.groups.map((group) => (
                      <button
                        type="button"
                        key={group.id}
                        onClick={() => setActiveGroupId(group.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border ${
                          group.id === activeGroupId
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>

                  {activeGroup ? (
                    <div className="space-y-3 rounded-xl border border-border p-4">
                      <div className="flex gap-2">
                        <label className="text-sm space-y-1 flex-1">
                          <span className="text-muted-foreground">Sub Category Name</span>
                          <input
                            value={activeGroup.name}
                            onChange={(e) =>
                              updateGroupField(activeGroup.id, "name", e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>
                        <label className="text-sm space-y-1 flex-1">
                          <span className="text-muted-foreground">Sub Category ID</span>
                          <input
                            value={activeGroup.id}
                            onChange={(e) => {
                              const nextId = slugify(e.target.value);
                              updateCategory((cat) => ({
                                ...cat,
                                groups: cat.groups.map((g) =>
                                  g.id === activeGroup.id ? { ...g, id: nextId } : g
                                ),
                              }));
                              setActiveGroupId(nextId);
                            }}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="text-sm space-y-1">
                          <span className="text-muted-foreground">Features</span>
                          <input
                            value={activeGroup.features ?? ""}
                            onChange={(e) =>
                              updateGroupField(activeGroup.id, "features", e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>
                        <label className="text-sm space-y-1">
                          <span className="text-muted-foreground">Default Pack</span>
                          <input
                            value={activeGroup.defaultPack ?? ""}
                            onChange={(e) =>
                              updateGroupField(activeGroup.id, "defaultPack", e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>
                        <label className="text-sm space-y-1">
                          <span className="text-muted-foreground">Default Price</span>
                          <input
                            value={activeGroup.defaultPrice ?? ""}
                            onChange={(e) =>
                              updateGroupField(activeGroup.id, "defaultPrice", e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Products</h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={addProduct}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-border"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Product
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGroup(activeGroup.id)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-destructive/30 text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Sub Category
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {activeGroup.products.map((product, index) => (
                          <div
                            key={`${product.name}-${index}`}
                            className="grid gap-2 sm:grid-cols-[1.2fr_1fr_1fr_1.6fr_auto] rounded-lg border border-border p-2"
                          >
                            <input
                              value={product.name}
                              onChange={(e) =>
                                updateProductField(index, "name", e.target.value)
                              }
                              placeholder="Product name"
                              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                            />
                            <input
                              value={product.pack ?? ""}
                              onChange={(e) =>
                                updateProductField(index, "pack", e.target.value)
                              }
                              placeholder="Pack"
                              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                            />
                            <input
                              value={product.price ?? ""}
                              onChange={(e) =>
                                updateProductField(index, "price", e.target.value)
                              }
                              placeholder="Price"
                              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                            />
                            <div className="rounded-md border border-border bg-background px-2 py-1.5 text-xs space-y-2">
                              <div className="text-muted-foreground truncate">
                                {product.image
                                  ? product.imageSource === "uploaded"
                                    ? "Uploaded image"
                                    : isCodebaseImage(product.image)
                                      ? "Codebase image"
                                      : "Image set"
                                  : "No image"}
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                <label className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 cursor-pointer hover:bg-muted">
                                  <Upload className="h-3 w-3" />
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        void handleUploadProductImage(index, file);
                                      }
                                      e.currentTarget.value = "";
                                    }}
                                  />
                                </label>
                                {product.image && (
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteProductImage(index)}
                                    className="inline-flex items-center gap-1 rounded-md border border-destructive/30 text-destructive px-2 py-1"
                                  >
                                    <ImageMinus className="h-3 w-3" />
                                    Delete
                                  </button>
                                )}
                              </div>
                              {uploadingImageKey === getProductKey(index) && (
                                <div className="inline-flex items-center gap-1 text-primary">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Uploading...
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProduct(index)}
                              className="inline-flex items-center justify-center rounded-md border border-destructive/30 text-destructive px-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Add a sub category to start adding products.
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm rounded-lg border border-destructive/30 bg-destructive/10 text-destructive px-3 py-2">
                    {error}
                  </p>
                )}
                {message && (
                  <p className="text-sm rounded-lg border border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 px-3 py-2">
                    {message}
                  </p>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Create a category to start.</div>
            )}
          </section>
        </div>
      ) : (
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Brochure PDF Builder</h2>
              <p className="text-sm text-muted-foreground">
                Poster style cover preview for the generated PDF.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Build PDF Cover Layout
            </span>
          </div>

          <div className="mx-auto w-full max-w-[840px]">
            <div
              className="relative overflow-hidden rounded-[28px] border border-border/80 p-4 sm:p-5 print:h-[297mm] print:w-[210mm] print:break-after-page print:rounded-none print:border-border/60 print:shadow-none"
              style={{
                aspectRatio: "210 / 297",
                background: "linear-gradient(145deg, #f8f7ef, #eff2e8 45%, #f5f8ef)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              <div className="pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full bg-[#8eb7a5]/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-14 h-44 w-44 rounded-full bg-[#5a8f7f]/20 blur-2xl" />
              <div className="flex h-full flex-col rounded-[24px] border border-[#d9ddcd] bg-[#fdfdf7] p-3 sm:p-4 print:bg-white">
                <div className="shrink-0 rounded-2xl border border-[#d7dfcf] bg-[#fbfcf6] px-4 pb-2 pt-3 sm:px-5">
                  <div className="flex items-center justify-center gap-3 text-[#114f45]">
                    <img
                      src="/images/logo.png"
                      alt="AJ Fresh Foods logo"
                      className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                    />
                    <div className="text-left leading-tight">
                      <p className="text-[22px] font-black tracking-tight sm:text-[24px]">AJ FRESH FOODS</p>
                      <p className="text-[11px] font-bold tracking-[0.22em] sm:text-xs">WHOLESALE</p>
                    </div>
                  </div>
                  <h3 className="mt-2 text-center text-[24px] font-black tracking-tight text-[#114f45] sm:text-[28px]">
                    WHOLESALE PRODUCT CATALOGUE
                  </h3>
                  <div className="mt-1.5 flex justify-center">
                    <p className="rounded-full bg-[#3d7f74] px-4 py-1 text-[12px] font-semibold text-white sm:text-sm">
                      Trusted Wholesale Range | Competitive Pricing | Fast Delivery
                    </p>
                  </div>
                </div>

                <div className="mt-2 shrink-0 overflow-hidden rounded-2xl border border-[#d2dac8] bg-[#edf2e4]">
                  <div className="relative h-32 sm:h-36">
                    {heroPreviewImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${heroPreviewImage}')` }}
                      />
                    )}
                    {!heroImageFailed && (
                      <img
                        src={heroCustomImageUrl}
                        alt="AJ Fresh Foods catalogue hero"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={() => setHeroImageFailed(true)}
                      />
                    )}
                    {!heroPreviewImage && heroImageFailed && (
                      <div className="h-full w-full bg-gradient-to-r from-[#6a8f7b] via-[#8ca98b] to-[#557266]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f3f37]/70 via-[#0f3f37]/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#fdfdf7] to-transparent" />
                  </div>
                </div>

                <div className="mb-2 mt-3 shrink-0 text-center">
                  <h4 className="text-xl font-black tracking-tight text-[#114f45] sm:text-[24px]">
                    Browse Our Product Categories
                  </h4>
                </div>

                <div className="grid flex-1 grid-cols-3 gap-2">
                  {coverCategories.map((category, index) => {
                    const previewImage = getCategoryPreviewImage(category);
                    return (
                      <div
                        key={category.id}
                        className="overflow-hidden rounded-xl border border-[#d8dcca] bg-[#f8faf2]"
                        style={{ boxShadow: "0 5px 12px rgba(17,79,69,0.08)" }}
                      >
                        <div className="relative h-20 bg-[#dfe7d8] sm:h-24">
                          {previewImage ? (
                            <div
                              className="h-full w-full bg-cover bg-center"
                              style={{ backgroundImage: `url('${previewImage}')` }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-[#95a98e] to-[#738a7f]" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                        </div>
                        <div className="px-2 py-1.5 text-center">
                          <p className="truncate text-[12px] font-black leading-tight text-[#153f36] sm:text-[15px]">
                            {category.name}
                          </p>
                          <p className="text-[8px] font-bold tracking-wide text-[#4b6e63] sm:text-[9px]">
                            CATEGORY {String(index + 1).padStart(2, "0")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-1.5 shrink-0 rounded-lg border border-[#d8dfce] bg-[#f7faef] px-2 py-1">
                  <p className="text-[8px] font-semibold uppercase tracking-wide text-[#2f5d53]">
                    All categories
                  </p>
                  <p className="text-[8px] leading-tight text-[#345f55]">
                    {allCategoryNames || "No categories available"}
                  </p>
                </div>

                <div className="mt-3 shrink-0 rounded-2xl border border-[#ced6c2] bg-[#0f5248] px-3 py-2 text-white sm:px-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white p-1">
                        <img
                          src="/images/logo.png"
                          alt="AJ Fresh Foods logo"
                          className="h-7 w-7 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight sm:text-base">Wholesale Supply for Retail Stores</p>
                        <p className="text-[9px] text-white/80 sm:text-[10px]">
                          {catalog.length} categories | {totalGroups} sub categories | {totalProducts} products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white p-1">
                        <img
                          src={qrCodeUrl}
                          alt={`QR code linking to ${websiteLabel}`}
                          className="h-12 w-12 sm:h-14 sm:w-14"
                        />
                      </div>
                      <div className="text-xs font-semibold sm:text-sm">
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2"
                        >
                          {websiteLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {productPages.map((page, pageIndex) => (
            <div key={`products-page-${page.pageNumber}`} className="mx-auto mt-5 w-full max-w-[840px]">
              <div
                className={`relative overflow-hidden rounded-[28px] border border-border/80 p-4 sm:p-5 print:h-[297mm] print:w-[210mm] print:rounded-none print:border-border/60 print:shadow-none ${
                  pageIndex < productPages.length - 1 ? "print:break-after-page" : ""
                }`}
                style={{
                  aspectRatio: "210 / 297",
                  background: "linear-gradient(145deg, #f8f7ef, #eff2e8 45%, #f5f8ef)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                <div className="flex h-full flex-col rounded-[24px] border border-[#d9ddcd] bg-[#fdfdf7] p-3 sm:p-4 print:bg-white">
                  <div className="shrink-0 rounded-2xl border border-[#d7dfcf] bg-[#fbfcf6] px-4 py-2.5">
                    <div className="flex items-center justify-between gap-3 text-[#114f45]">
                      <div className="flex items-center gap-2">
                        <img
                          src="/images/logo.png"
                          alt="AJ Fresh Foods logo"
                          className="h-9 w-9 object-contain"
                        />
                        <div>
                          <p className="text-[18px] font-black tracking-tight">AJ FRESH FOODS</p>
                          <p className="text-[10px] font-bold tracking-[0.18em]">WHOLESALE CATALOGUE</p>
                        </div>
                      </div>
                      <div className="rounded-full bg-[#114f45]/10 px-3 py-1 text-[10px] font-bold text-[#114f45]">
                        Page {pageIndex + 2}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-base font-black text-[#114f45] sm:text-lg">Product Catalogue Details</p>
                      <p className="text-[10px] font-semibold text-[#2f5d53]">
                        Product Page {page.pageNumber} / {page.totalPages}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 grid flex-1 grid-cols-2 gap-2 content-start">
                    {page.entries.length > 0 ? (
                      page.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-[#d6decc] bg-white p-2"
                          style={{ boxShadow: "0 4px 10px rgba(17,79,69,0.08)" }}
                        >
                          <div className="flex gap-2">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#d8dfce] bg-[#edf2e4]">
                              {entry.image ? (
                                <div
                                  className="h-full w-full bg-cover bg-center"
                                  style={{ backgroundImage: `url('${entry.image}')` }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#95a98e] to-[#738a7f] text-[9px] font-bold text-white">
                                  NO IMAGE
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] font-black text-[#143f36]">{entry.name}</p>
                              <div className="mt-0.5 space-y-0.5 text-[9px]">
                                <p className="truncate text-[#3c6158]">
                                  <span className="font-bold uppercase tracking-wide text-[#2f5d53]">
                                    Category:
                                  </span>{" "}
                                  <span className="font-semibold">{entry.categoryName}</span>
                                </p>
                                <p className="truncate text-[#3c6158]">
                                  <span className="font-bold uppercase tracking-wide text-[#2f5d53]">
                                    Sub Category:
                                  </span>{" "}
                                  <span className="font-semibold">{entry.groupName}</span>
                                </p>
                              </div>
                              <div className="mt-1 space-y-0.5 text-[9px] text-[#2c4f46]">
                                <p>
                                  <span className="font-bold">Pack:</span> {entry.pack}
                                </p>
                                <p>
                                  <span className="font-bold">Price:</span> {entry.price}
                                </p>
                                <p className="truncate">
                                  <span className="font-bold">Features:</span> {entry.features?.trim() || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 rounded-xl border border-dashed border-[#cbd6c0] bg-white/70 p-6 text-center text-sm font-medium text-[#4b6e63]">
                        No products added in this category yet.
                      </div>
                    )}
                  </div>

                  <div className="mt-2 shrink-0 rounded-2xl border border-[#ced6c2] bg-[#0f5248] px-3 py-2 text-white">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold">
                        {page.entries.length} products on this page | {totalProducts} total products
                      </p>
                      <div className="flex items-center gap-2">
                        <img
                          src={qrCodeUrl}
                          alt={`QR code linking to ${websiteLabel}`}
                          className="h-10 w-10 rounded bg-white p-0.5"
                        />
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-semibold underline underline-offset-2"
                        >
                          {websiteLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
