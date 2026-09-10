"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { orbitAvatars } from "./data";

gsap.registerPlugin(useGSAP);

/**
 * The radar-ring + floating-avatar composition behind the hero headline.
 * GSAP drives the continuous, physics-y motion (independent float loops,
 * ring pulses) since that's a better fit than React state for infinite,
 * off-timeline animation loops.
 */
export default function FloatingAvatars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect reduced-motion preferences: skip the infinite float/pulse
      // loops entirely and leave the composition in its settled state.
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      // Gentle, independent float for every avatar bubble.
      const avatarEls = gsap.utils.toArray<HTMLElement>("[data-avatar]");
      avatarEls.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -14 : -10,
          x: i % 3 === 0 ? 6 : -6,
          duration: 3 + (i % 4) * 0.6,
          delay: Number(el.dataset.delay) || 0,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Radar rings pulsing outward from the centre.
      const rings = gsap.utils.toArray<HTMLElement>("[data-ring]");
      rings.forEach((ring, i) => {
        gsap.fromTo(
          ring,
          { scale: 0.85, opacity: 0.55 },
          {
            scale: 1,
            opacity: 0.15,
            duration: 3.2,
            delay: i * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      });

      // Slow whole-group drift so the composition never feels static.
      gsap.to("[data-orbit-group]", {
        rotate: 3,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      aria-hidden
    >
      {/* concentric radar rings */}
      <div className="absolute inset-0 grid place-items-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            data-ring
            className="absolute rounded-full border border-[#2F4CDD]/15"
            style={{
              width: `${28 + i * 24}%`,
              height: `${28 + i * 24}%`,
            }}
          />
        ))}
      </div>

      <div data-orbit-group className="absolute inset-0">
        {orbitAvatars.map((avatar, i) => (
          <motion.div
            key={avatar.id}
            data-avatar
            data-delay={avatar.floatDelay}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.3 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute"
            style={{
              top: avatar.top,
              left: avatar.left,
              width: avatar.size,
              height: avatar.size,
            }}
          >
            <div className="relative h-full w-full">
              <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-white shadow-[0_8px_24px_-6px_rgba(20,30,80,0.25)]">
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <span
                className={`absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm ${
                  avatar.badge === "green" ? "bg-[#3FB868]" : "bg-[#2F6FED]"
                }`}
              >
                ₹
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
