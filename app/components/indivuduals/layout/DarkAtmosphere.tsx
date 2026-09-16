import type { ReactNode } from "react";

/**
 * The single continuous gradient environment that Hero, Curriculum and Partner
 * Network live inside.
 *
 * Never apply `transform`, `filter` or `will-change` to this element: it is the
 * ancestor of the Partner Network's pinned ScrollTrigger, and any of those
 * properties would create a containing block and silently break pinning.
 */
export function DarkAtmosphere({ children }: { readonly children: ReactNode }) {
  return (
    <div className="atmosphere">
      <div className="atmosphere__wash" aria-hidden="true" />
      <div className="atmosphere__grain" aria-hidden="true" />
      {children}
    </div>
  );
}
