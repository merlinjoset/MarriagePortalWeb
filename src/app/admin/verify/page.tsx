"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminHeader, Avatar, Pill } from "@/components/admin/admin-ui";
import { api } from "@/lib/api";
import type { ProfileListItem } from "@/lib/types";

export default function VerifyQueue() {
  const [rows, setRows] = useState<ProfileListItem[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .browseProfiles({ status: "Pending", pageSize: 100 })
      .then((r) => setRows(r.items))
      .catch(() => setRows([]));
  }, []);

  useEffect(load, [load]);

  async function decide(id: string, status: "Verified" | "Active", name: string) {
    setBusy(id);
    try {
      await api.setStatus(id, status);
      setRows((rs) => (rs ? rs.filter((r) => r.id !== id) : rs));
      toast.success(status === "Verified" ? `${name} approved & verified.` : `${name} sent back to the member.`);
    } catch {
      toast.error("Action failed. Is the API running?");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <AdminHeader
        title="Verification Queue"
        subtitle="Confirm faith & parish membership before approving a profile."
      />
      <div className="p-7">
        <div className="mb-4 rounded-lg border border-brand-green/25 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">
          🕊️ <b>Reminder:</b> Verify the member belongs to a partner parish. Never record caste or community.
        </div>

        <Card className="p-0">
          {rows === null ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : rows.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">No profiles waiting — all caught up. 🕊️</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-[11.5px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-bold">Member</th>
                  <th className="px-5 py-3 font-bold">Home parish</th>
                  <th className="px-5 py-3 font-bold">Denomination</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((m, i) => (
                  <tr key={m.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.fullName} photo={m.mainPhotoUrl} i={i} />
                        <div>
                          <div className="text-sm font-semibold">
                            {m.fullName} {m.mainPhotoUrl && <span title="Has photo">📷</span>}
                          </div>
                          <div className="text-[12px] text-muted-foreground">
                            {m.referenceId} · {m.gender === "Female" ? "Bride" : "Groom"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm">{m.congregation}</td>
                    <td className="px-5 py-3 text-sm">{m.denomination}</td>
                    <td className="px-5 py-3"><Pill tone="amber">Pending</Pill></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={busy === m.id}
                          onClick={() => decide(m.id, "Verified", m.fullName)}
                          className="bg-brand-green text-white hover:bg-brand-green/90"
                        >
                          ✓ Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === m.id}
                          onClick={() => decide(m.id, "Active", m.fullName)}
                          className="border-destructive/40 text-destructive hover:bg-destructive/5"
                        >
                          ✕ Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}
