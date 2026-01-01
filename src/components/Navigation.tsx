"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

export function Navigation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push("/#priser");
    } else {
      document.getElementById("priser")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo only - image already contains text */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="AIoli"
              width={180}
              height={72}
              style={{ height: '64px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded transition-colors ${
                  language === "en"
                    ? "bg-[var(--plasma-blue)] text-white"
                    : "nav-link"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("sv")}
                className={`px-2 py-1 rounded transition-colors ${
                  language === "sv"
                    ? "bg-[var(--plasma-blue)] text-white"
                    : "nav-link"
                }`}
              >
                SV
              </button>
            </div>

            <a href="/#priser" onClick={handlePricingClick} className="nav-link text-sm cursor-pointer">
              {t.nav.buyCredits}
            </a>

            {session && (
              <Link href="/history" className="nav-link text-sm">
                {t.nav.history}
              </Link>
            )}

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--plasma-blue)]/20 text-[var(--plasma-blue)]">
                  {session.user?.credits ?? 0} {t.nav.credits}
                </span>
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm nav-link"
                >
                  {t.nav.logOut}
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t.nav.logIn}
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" aria-label="Menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
