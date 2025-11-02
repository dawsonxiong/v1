"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaRegEnvelope } from "react-icons/fa6";
import { RiGithubLine, RiLinkedinLine, RiTwitterXLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
const navLinks = [
  { href: "/", label: "about" },
  { href: "/experience", label: "experience" },
  { href: "/projects", label: "projects" },
  { href: "/life", label: "life" },
];

const socialLinks = [
  {
    label: "github",
    href: "https://github.com/dawsonxiong",
    icon: RiGithubLine,
  },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/dawsonxiong",
    icon: RiLinkedinLine,
  },
  {
    label: "x (twitter)",
    href: "https://x.com/dawsonxiong",
    icon: RiTwitterXLine,
  },
  {
    label: "email",
    href: "mailto:dawsonxiong@gmail.com",
    icon: FaRegEnvelope,
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-transparent"
    >
      <div className="mx-auto flex max-w-[600px] items-center justify-between px-6 py-6">
        {/* <Link href="/" className="text-lg font-medium text-zinc-900 transition-colors hover:text-zinc-600">
          dawson xiong
        </Link> */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900",
                )}
              >
                {label}
                {isActive ? (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 -z-10 rounded-md bg-zinc-100"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-zinc-400 transition-colors hover:text-zinc-900"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
