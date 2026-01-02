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
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`navbar-floating ${isScrolled ? "shadow-glass-lg" : ""}`}
        style={{
          background: isScrolled
            ? "rgba(10, 10, 10, 0.85)"
            : "rgba(10, 10, 10, 0.6)",
        }}
      >
        <div className="flex items-center gap-1">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pr-4">
            <Image
              src="/logo.png"
              alt="AIoli"
              width={140}
              height={56}
              className="h-10 w-auto"
            />
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-white/10" />

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1 pl-2">
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
          <div className="hidden md:block w-px h-4 bg-white/10 ml-2" />

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3 pl-3">
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
                  className="nav-link"
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 ml-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
            ) : (
              <Menu className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </motion.nav>

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
