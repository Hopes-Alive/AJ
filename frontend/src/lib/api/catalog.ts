"use client";

import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types";
import { BACKEND_BASE_URL } from "@/lib/api/base-url";

const API_BASE = BACKEND_BASE_URL;

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
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
  const headers = await getAuthHeader();
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
