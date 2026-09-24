import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Sparkles } from 'lucide-react';

export const FloatingBadges: React.FC = () => {
  const [polarDismissed, setPolarDismissed] = useState(false);

  return (
    <>
      {/* 1. Polar Floating Badge (Bottom Left) */}
      <AnimatePresence>
        {!polarDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-2"
          >
            <a
              href="https://buy.polar.sh/polar_cl_yvNcB7QbIblZqvyFy3DrSVbVhPiro2APec3OS4cvSND"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#141414] text-white text-xs font-medium shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-neutral-800 transition-all duration-200 border border-white/10 group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Orionix Template only $99</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
            <button
              onClick={() => setPolarDismissed(true)}
              className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-white/60 hover:text-white backdrop-blur-sm transition-colors cursor-pointer"
              title="Dismiss"
              aria-label="Dismiss template badge"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Awwwards Side Ribbon (Right Edge) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
        <a
          href="https://www.awwwards.com/sites/orionix-creative-agency"
          target="_blank"
          rel="noreferrer"
          className="group block bg-[#141414] text-white py-3 px-1.5 rounded-l-xl shadow-xl border-l border-t border-b border-white/10 hover:bg-black transition-all"
          title="Orionix on Awwwards"
        >
          <div className="writing-mode-vertical text-[10px] font-mono tracking-widest uppercase text-white/80 group-hover:text-white flex items-center gap-1.5 py-1" style={{ writingMode: 'vertical-rl' }}>
            <span>Awwwards Nominee</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          </div>
        </a>
      </div>
    </>
  );
};
