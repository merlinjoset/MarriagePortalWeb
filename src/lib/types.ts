// Mirrors the .NET API DTOs (CsiMatrimony.Application.Profiles)

export type Gender = "Female" | "Male";
export type ProfileStatus = "Pending" | "Verified" | "Active" | "Suspended";

export interface ProfileListItem {
  id: string;
  referenceId: string;
  fullName: string;
  gender: Gender;
  age: number | null;
  height: string | null;
  denomination: string;
  congregation: string;
  education: string | null;
  profession: string | null;
  city: string | null;
  mainPhotoUrl: string | null;
  status: ProfileStatus;
}

export interface ProfileDetail extends ProfileListItem {
  createdFor: string;
  lookingFor: string;
  maritalStatus: string;
  motherTongue: string;
  homeParish: string;
  aboutFaith: string | null;
  fatherOccupation: string | null;
  motherOccupation: string | null;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProfileStats {
  total: number;
  pending: number;
  verified: number;
  active: number;
  suspended: number;
}

export interface MemberValidation {
  valid: boolean;
  name: string | null;
  congregation: string | null;
  message: string | null;
}

export interface CreateProfileInput {
  membershipNo: string;
  createdFor: string;
  lookingFor: string;
  mobile: string;
  fullName: string;
  gender: Gender;
  dateOfBirth: string | null; // yyyy-MM-dd
  height?: string | null;
  maritalStatus: string;
  motherTongue: string;
  denomination: string;
  homeParish: string;
  congregation: string;
  aboutFaith?: string | null;
  education?: string | null;
  profession?: string | null;
  city?: string | null;
  fatherOccupation?: string | null;
  motherOccupation?: string | null;
  mainPhotoUrl?: string | null;
}

export const CONGREGATIONS = ["Dubai", "Fujairah", "Ras Al Khaimah", "India", "Other"] as const;
export const DENOMINATIONS = ["CSI", "Pentecostal", "Lutheran", "Roman Catholic", "Other Christian"] as const;

// ---- Admin users ----
export type AdminUserStatus = "Invited" | "Active" | "Disabled";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  congregation: string;
  status: AdminUserStatus;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
  congregation: string;
}

export const ADMIN_ROLES = [
  "Diocese Admin",
  "Parish Presbyter",
  "Moderator",
  "Office Staff",
] as const;

export const ADMIN_CONGREGATIONS = [
  "Dubai (Main)",
  "Fujairah",
  "Ras Al Khaimah",
] as const;

// ---- Interests ----
export type InterestStatus = "Awaiting" | "Accepted" | "Declined";

export interface Interest {
  id: string;
  toProfileId: string;
  toName: string;
  toReferenceId: string;
  fromName: string;
  fromMobile: string;
  message: string | null;
  status: InterestStatus;
  createdAt: string;
}

export interface CreateInterestInput {
  toProfileId: string;
  fromName: string;
  fromMobile: string;
  message?: string | null;
}
