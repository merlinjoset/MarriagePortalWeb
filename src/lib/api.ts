import type {
  AdminUser,
  CreateInterestInput,
  CreateProfileInput,
  CreateUserInput,
  Interest,
  InterestStatus,
  MemberValidation,
  PagedResult,
  ProfileDetail,
  ProfileListItem,
  ProfileStats,
  ProfileStatus,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5117/api";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface BrowseParams {
  gender?: string;
  denomination?: string;
  congregation?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const api = {
  browseProfiles(params: BrowseParams = {}): Promise<PagedResult<ProfileListItem>> {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
    });
    const qs = q.toString();
    return http<PagedResult<ProfileListItem>>(`/profiles${qs ? `?${qs}` : ""}`);
  },

  getProfile(id: string): Promise<ProfileDetail> {
    return http<ProfileDetail>(`/profiles/${id}`);
  },

  createProfile(input: CreateProfileInput): Promise<ProfileDetail> {
    return http<ProfileDetail>(`/profiles`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  validateMembership(membershipNo: string): Promise<MemberValidation> {
    return http<MemberValidation>(`/members/validate?membershipNo=${encodeURIComponent(membershipNo)}`);
  },

  getStats(): Promise<ProfileStats> {
    return http<ProfileStats>(`/profiles/stats`);
  },

  setStatus(id: string, status: ProfileStatus): Promise<void> {
    return http<void>(`/profiles/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  getUsers(): Promise<AdminUser[]> {
    return http<AdminUser[]>(`/admin/users`);
  },

  createUser(input: CreateUserInput): Promise<AdminUser> {
    return http<AdminUser>(`/admin/users`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  createInterest(input: CreateInterestInput): Promise<Interest> {
    return http<Interest>(`/interests`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getInterests(): Promise<Interest[]> {
    return http<Interest[]>(`/interests`);
  },

  setInterestStatus(id: string, status: InterestStatus): Promise<void> {
    return http<void>(`/interests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async uploadPhoto(file: File): Promise<{ url: string }> {
    const fd = new FormData();
    fd.append("file", file);
    // No Content-Type header — the browser sets the multipart boundary itself.
    const res = await fetch(`${BASE}/uploads/photo`, { method: "POST", body: fd });
    if (!res.ok) throw new ApiError(res.status, (await res.text().catch(() => "")) || res.statusText);
    return (await res.json()) as { url: string };
  },
};

export { ApiError };
