import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * The single place GSAP plugins are registered.
 *
 * Registering is idempotent, but centralising it means no section has to think
 * about it and there is exactly one import path for the rest of the app.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * ScrollTrigger recalculates on every mobile browser-chrome resize by default,
 * which fires constantly while scrolling on iOS and Android and causes visible
 * jumps in pinned sections.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
