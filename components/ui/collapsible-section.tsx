"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type CollapsibleSectionProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string;
};

export default function CollapsibleSection({
  title,
  description,
  icon,
  actions,
  children,
  defaultOpen = true,
  className,
  contentClassName,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className={cn(
        "rounded-[36px] border border-white/10 bg-white/[0.04] p-8 transition-[border-color,background-color,box-shadow] duration-200",
        open ? "shadow-none" : "bg-white/[0.035]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="group flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          {icon && (
            <span className="mt-1 shrink-0">
              {icon}
            </span>
          )}

          <span className="min-w-0">
            <span className="block text-3xl font-semibold transition group-hover:text-neutral-200">
              {title}
            </span>

            {description && (
              <span className="mt-2 block text-neutral-400">
                {description}
              </span>
            )}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-3">
          {actions}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            aria-expanded={open}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-[0.98]"
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                open ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out",
          open ? "mt-7 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className={contentClassName}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
