import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/marketlab/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/markets" className="flex items-center gap-3">
            <Image
              src="/logo/logo-marketlab.webp"
              alt="MarketLab"
              width={677}
              height={369}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="hidden text-lg font-semibold sm:inline">
              MarketLab
            </span>
          </Link>
          <nav>
            <Link
              href="/markets"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Markets
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="hidden sm:block"
            data-testid="auth-placeholder"
            aria-hidden="true"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
