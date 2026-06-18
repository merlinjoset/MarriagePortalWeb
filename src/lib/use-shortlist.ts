"use client";

import { useCallback, useEffect, useState } from "react";

export interface ShortlistItem {
  id: string;
  fullName: string;
  referenceId: string;
  gender: "Female" | "Male";
  age: number | null;
  congregation: string;
  denomination: string;
  mainPhotoUrl: string | null;
}

const KEY = "csi_shortlist";

function read(): ShortlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/** Per-browser shortlist persisted in localStorage (no login required). */
export function useShortlist() {
  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: ShortlistItem[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);

  const toggle = useCallback(
    (item: ShortlistItem) => {
      const exists = read().some((x) => x.id === item.id);
      const next = exists ? read().filter((x) => x.id !== item.id) : [item, ...read()];
      persist(next);
      return !exists; // true if now shortlisted
    },
    [persist]
  );

  const remove = useCallback((id: string) => persist(read().filter((x) => x.id !== id)), [persist]);

  return { items, ready, count: items.length, has, toggle, remove };
}
