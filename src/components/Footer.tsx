"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mx-auto flex max-w-[600px] flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-zinc-500 sm:flex-row"
    >
      <span>
        based in toronto 🇨🇦 ·{" "}
        <a
          href="https://cal.com/dawsonxiong/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors"
        >
          chat with me
        </a>
      </span>

      <div className="flex items-center gap-2 text-zinc-600">
        <a href="https://cs.uwatering.com/#dawsonxiong.com?nav=prev">←</a>
        <a
          href="https://cs.uwatering.com/#dawsonxiong.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://cs.uwatering.com/icon.black.svg"
            alt="CS Webring"
            width={24}
            height={24}
            className="opacity-80"
          />
        </a>
        <a href="https://cs.uwatering.com/#dawsonxiong.com?nav=next">→</a>
      </div>
    </motion.footer>
  );
}
