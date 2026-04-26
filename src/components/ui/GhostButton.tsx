import Link from "next/link";
import type { ReactNode } from "react";

type GhostButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "accent" | "white";
  className?: string;
  type?: "button" | "submit";
};

const base =
  "inline-flex min-h-11 min-w-[11rem] items-center justify-center rounded-full border px-6 py-2 text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-deepSpace";

const variants: Record<NonNullable<GhostButtonProps["variant"]>, string> = {
  accent:
    "border-accent text-accent hover:bg-accent hover:text-white active:bg-accent/90",
  white:
    "border-white/70 text-white hover:bg-white hover:text-deepSpace active:bg-white/90",
};

export function GhostButton({ children, href, onClick, variant = "accent", className = "", type = "button" }: GhostButtonProps) {
  const styles = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
