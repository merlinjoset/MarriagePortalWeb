"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { useT } from "@/lib/i18n";
import { useMemberShortlist } from "@/lib/member-shortlist";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t, lang, setLang } = useT();
  const { count, member, signOut, openSignIn } = useMemberShortlist();

  const nav = [
    { href: "/", label: t("nav_home") },
    { href: "/browse", label: t("nav_browse") },
    { href: "/how-it-works", label: t("nav_how") },
    { href: "/shortlist", label: t("nav_shortlist"), badge: count },
    // Contact-request approvals are only meaningful once signed in.
    ...(member ? [{ href: "/requests", label: t("nav_requests") }] : []),
    // Register is only for people who are not yet signed-in members.
    ...(member ? [] : [{ href: "/register", label: t("nav_register") }]),
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-maroon to-maroon-2 text-white shadow-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center gap-3 px-5">
        <MobileNav />
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/emblem.jpg"
            alt="Church of South India"
            width={44}
            height={44}
            className="rounded-full bg-white p-[3px] shadow"
            priority
          />
          <span className="leading-tight">
            <span className="block text-[19px] font-bold tracking-wide">{t("brand")}</span>
            <span className="block text-[11px] opacity-85">{t("brand_sub")}</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold opacity-90 transition hover:bg-white/10 hover:opacity-100"
            >
              {n.label}
              {n.badge ? (
                <span className="grid min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-maroon">
                  {n.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        {/* Language toggle */}
        <div className="ml-auto flex items-center gap-0.5 rounded-full bg-black/20 p-0.5 lg:ml-3">
          {(["en", "ta"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[13px] font-bold transition",
                lang === l ? "bg-gold text-maroon" : "text-white/70 hover:text-white"
              )}
            >
              {l === "en" ? "EN" : "தமிழ்"}
            </button>
          ))}
        </div>

        {/* Member sign-in / account */}
        {member ? (
          <div className="hidden items-center gap-2 sm:flex">
            <span className="max-w-[120px] truncate text-[13px] font-semibold opacity-90" title={member.name}>
              {member.name}
            </span>
            <button onClick={signOut} className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold opacity-80 hover:bg-white/10 hover:opacity-100">
              {t("signout")}
            </button>
          </div>
        ) : (
          <button onClick={openSignIn} className="hidden rounded-lg px-3 py-2 text-sm font-semibold opacity-90 hover:bg-white/10 hover:opacity-100 sm:block">
            {t("nav_signin")}
          </button>
        )}

        <Button
          render={<Link href="/register" />}
          nativeButton={false}
          className="hidden bg-gold text-maroon hover:bg-gold! hover:brightness-105 sm:inline-flex"
        >
          {t("create_profile")}
        </Button>
      </div>
    </header>
  );
}
