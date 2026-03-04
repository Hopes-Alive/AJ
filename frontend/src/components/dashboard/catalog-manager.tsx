"use client";

import { useEffect, useMemo, useState } from "react";
import { Category } from "@/types";
import { categories as fallbackCategories } from "@/data/products";
import { getCatalog, saveCatalog } from "@/lib/api/catalog";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

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

export function CatalogManager() {
  const [catalog, setCatalog] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

  return (
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
                        className="grid gap-2 sm:grid-cols-[1.2fr_1fr_1fr_1.5fr_auto] rounded-lg border border-border p-2"
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
                        <input
                          value={product.image ?? ""}
                          onChange={(e) =>
                            updateProductField(index, "image", e.target.value)
                          }
                          placeholder="Image URL/path (empty = no image)"
                          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                        />
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
  );
}
