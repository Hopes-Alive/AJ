"use client";

import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types";
import { BACKEND_BASE_URL } from "@/lib/api/base-url";

const API_BASE = BACKEND_BASE_URL;

async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return session.access_token;
}

async function getJsonAuthHeader(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getCatalog(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/api/catalog`, { cache: "no-store" });
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Failed to load catalog");
  }

  return (json.data ?? []) as Category[];
}

export async function saveCatalog(categories: Category[]): Promise<void> {
  const headers = await getJsonAuthHeader();
  const res = await fetch(`${API_BASE}/api/catalog`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ categories }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Failed to save catalog");
  }
}

export async function uploadCatalogImage(file: File): Promise<{
  imageUrl: string;
  storagePath: string;
}> {
  const token = await getAccessToken();
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/api/catalog/images/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Failed to upload image");
  }
  return json.data;
}

export async function deleteCatalogImage(storagePath: string): Promise<void> {
  const headers = await getJsonAuthHeader();
  const res = await fetch(`${API_BASE}/api/catalog/images`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ storagePath }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "Failed to delete image");
  }
}
