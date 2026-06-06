import Image from "next/image";
import Link from "next/link";

import { HeaderAuth } from "@/components/marketlab/header-auth";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { getCurrentProfile, getCurrentUser } from "@/lib/profile/queries";

export async function Header() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;

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
          <nav className="flex items-center gap-4">
            <Link
              href="/markets"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Markets
            </Link>
            <Link
              href="/positions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Positions
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <HeaderAuth user={user} profile={profile} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
