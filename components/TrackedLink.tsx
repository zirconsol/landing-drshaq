"use client";

import Link, { type LinkProps } from "next/link";
import type { PropsWithChildren } from "react";
import {
  trackPublicEvent,
  type PublicEventSource,
} from "@/lib/public-analytics";

type TrackedLinkProps = PropsWithChildren<
  LinkProps & {
    className?: string;
    source: PublicEventSource;
  }
>;

export default function TrackedLink({
  children,
  source,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        void trackPublicEvent("cta_click", source);
      }}
    >
      {children}
    </Link>
  );
}
