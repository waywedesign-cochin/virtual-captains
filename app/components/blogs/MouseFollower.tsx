import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const MouseFollower: React.FC = () => {
  const [cursorState, setCursorState] = useState<{
    visible: boolean;
    text: string;
    variant: 'read' | 'work' | 'view' | 'default';
  }>({
    visible: false,
    text: '',
    variant: 'default',
  });

  const [isPressed, setIsPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Buttery smooth spring for organic trailing momentum
  const springConfig = { damping: 24, stiffness: 320, mass: 0.32 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch-only devices
    if (
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) || navigator.maxTouchPoints > 0) &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest element with data-cursor attribute
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;

      if (cursorTarget) {
        const cursorType = cursorTarget.getAttribute('data-cursor');
        const customText = cursorTarget.getAttribute('data-cursor-text');

        if (cursorType === 'read' || cursorType === 'article') {
          setCursorState({
            visible: true,
            text: customText || 'Read article',
            variant: 'read',
          });
        } else if (cursorType === 'work' || cursorType === 'project') {
          setCursorState({
            visible: true,
            text: customText || 'Open Project',
            variant: 'work',
          });
        } else if (cursorType === 'view') {
          setCursorState({
            visible: true,
            text: customText || 'View more',
            variant: 'view',
          });
        } else {
          setCursorState({
            visible: true,
            text: customText || '',
            variant: 'default',
          });
        }
      } else {
        setCursorState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => {
      setCursorState((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: cursorState.visible ? (isPressed ? 0.94 : 1) : 0,
          opacity: cursorState.visible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 28,
        }}
        className="relative overflow-hidden rounded-full px-5 py-2.5 bg-[#201d24]/85 backdrop-blur-[12px] border border-white/12 shadow-[0_12px_30px_rgba(0,0,0,0.35),0_0_1px_rgba(255,255,255,0.15)] select-none pointer-events-none flex items-center justify-center whitespace-nowrap"
      >
        {/* Subtle Framer top-down sheen highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-transparent to-transparent pointer-events-none rounded-full" />

        {/* Cursor Pill Text */}
        <span className="relative z-10 text-[13px] sm:text-[13.5px] font-medium tracking-tight text-white leading-none font-sans drop-shadow-sm">
          {cursorState.text}
        </span>
      </motion.div>
    </motion.div>
  );
};
