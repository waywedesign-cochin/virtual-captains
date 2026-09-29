"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { useHeadingZoom } from "@/components/about/useHeadingZoom";

type ZoomHeadingProps = ComponentPropsWithoutRef<"h2"> & {
  as?: "h1" | "h2" | "h3";
};

/**
 * A heading that plays the site-wide zoom-in (see lib/animations/headingReveal)
 * as it enters the viewport. Lets server components opt in without becoming
 * client components themselves.
 */
export default function ZoomHeading({ as: Tag = "h2", ...props }: ZoomHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(ref);
  return <Tag ref={ref} {...props} />;
}
