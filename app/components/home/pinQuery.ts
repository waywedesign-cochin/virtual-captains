/**
 * Viewports that get the scroll-pinned desktop experience: wide AND tall
 * enough for a full-screen stage. Mirrors the `pin:` Tailwind variant in
 * app/globals.css — change both together.
 */
export const PIN_QUERY = "(min-width: 1024px) and (min-height: 600px)";

/** Everything else: stacked, non-pinned mobile/tablet layout. */
export const NO_PIN_QUERY = "not all and (min-width: 1024px) and (min-height: 600px)";
