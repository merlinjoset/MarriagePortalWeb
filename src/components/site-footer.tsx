"use client";

import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="mt-12 bg-[#2c2522] text-[#c9beb2]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3">
        <div>
          <h5 className="mb-3 text-[15px] font-semibold text-white">✝ {t("brand")}</h5>
          <p className="text-sm leading-relaxed">{t("foot_about")}</p>
          <p className="mt-2 text-sm text-[#d8cabb]">{t("foot_heritage")}</p>
        </div>
        <div>
          <h5 className="mb-3 text-[15px] font-semibold text-white">{t("foot_office")}</h5>
          <p className="text-sm">St Paul&apos;s Hall, Holy Trinity Church Compound, Oud Metha, Dubai, UAE</p>
          <p className="text-sm">office@csitamilparishdubai.com</p>
          <p className="text-sm">+971 50 138 6756</p>
        </div>
        <div>
          <h5 className="mb-3 text-[15px] font-semibold text-white">{t("foot_explore")}</h5>
          <a href="/browse" className="block text-sm hover:text-white">{t("nav_browse")}</a>
          <a href="/how-it-works" className="block text-sm hover:text-white">{t("nav_how")}</a>
          <a href="/register" className="block text-sm hover:text-white">{t("nav_register")}</a>
        </div>
      </div>
      <div className="border-t border-[#463d37] py-4 text-center text-xs text-[#9a8f84]">
        <div>{t("foot_copy")}</div>
        <div className="mt-1">
          {t("powered_by")}{" "}
          <a
            href="http://merlinjose.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#c9a24b] hover:underline"
          >
            Merlin Jose
          </a>
        </div>
      </div>
    </footer>
  );
}
