"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Learn", href: "/learn" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      {/* Navbar wrapper - positions logo and pill */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between lg:justify-center gap-4 lg:gap-6">
          {/* Logo - Outside the pill, larger */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="AIoli"
              width={180}
              height={72}
              className="h-10 lg:h-12 w-auto object-contain brightness-110"
              style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.2))" }}
              priority
            />
          </Link>

          {/* The Pill - Navigation */}
          <nav
            className={`flex items-center gap-1 rounded-full px-2 py-2 border backdrop-blur-xl ${isScrolled ? "shadow-glass-lg" : ""}`}
            style={{
              background: isScrolled
                ? "rgba(10, 10, 10, 0.85)"
                : "rgba(10, 10, 10, 0.6)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-4 bg-white/10" />

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-3 pl-2">
              {status === "loading" ? (
                <div className="w-20 h-8 rounded-md bg-white/5 animate-pulse" />
              ) : session ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
                    <span className="font-mono text-text-secondary">
                      {session.user?.credits || 0}
                    </span>
                  </div>
                  <Link
                    href="/history"
                    className="nav-link"
                  >
                    History
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="nav-link whitespace-nowrap"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile Menu Button - show below lg breakpoint */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
              )}
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-50 glass-card-elevated p-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-link py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="divider my-2" />
              {session ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                    <span className="font-mono text-text-secondary">
                      {session.user?.credits || 0} credits
                    </span>
                  </div>
                  <Link
                    href="/history"
                    className="nav-link py-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    History
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="nav-link py-3 text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary w-full mt-2"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
