"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Handshake, Sparkles, School, Building, Megaphone } from "./Icons";
import { PartnershipModel } from "../types";
import { PARTNERSHIP_MODELS } from "../data/partnerships";

interface PartnerModalProps {
  model: PartnershipModel | null;
  onClose: () => void;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({ model, onClose }) => {
  const [selectedId, setSelectedId] = useState<string>(model?.id || "corporate");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (model) {
      setSelectedId(model.id);
    }
  }, [model]);

  if (!model) return null;

  const currentModel =
    PARTNERSHIP_MODELS.find((m) => m.id === selectedId) || model;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 2000);
    }, 500);
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <School className="w-5 h-5 text-[#2563eb]" />;
      case "corporate":
        return <Building className="w-5 h-5 text-[#1d4ed8]" />;
      case "brand":
        return <Megaphone className="w-5 h-5 text-emerald-500" />;
      default:
        return <Handshake className="w-5 h-5 text-[#38bdf8]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#02050e]/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-lg bg-[#070b19] border border-white/15 rounded-[28px] sm:rounded-4xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] z-10 my-auto text-white"
        >
          {/* Top Banner with Virtual Captains Navy/Cyan Brand Accent */}
          <div className="relative h-28 sm:h-32 bg-linear-to-r from-[#0a1c52] via-[#1d4ed8] to-[#0284c7] p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                {getModelIcon(currentModel.iconType)}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/35 backdrop-blur-md px-2.5 py-0.5 rounded-full inline-block mb-1 text-[#38bdf8]">
                  {currentModel.badge || "PARTNERSHIP PROGRAM"}
                </span>
                <h3 className="font-sans font-black text-lg sm:text-xl leading-tight text-white drop-shadow-sm">
                  {currentModel.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-7">
            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4 animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-sans font-black text-2xl text-white uppercase tracking-tight mb-2">
                  Inquiry Received!
                </h4>
                <p className="text-zinc-300 text-xs sm:text-sm max-w-xs leading-relaxed">
                  Thank you for your interest in partnering with SalesX. Our ecosystem director will reach out to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Model Selector Pills */}
                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">
                    Partnership Track
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PARTNERSHIP_MODELS.map((pm) => (
                      <button
                        type="button"
                        key={pm.id}
                        onClick={() => setSelectedId(pm.id)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center truncate ${
                          selectedId === pm.id
                            ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30 border border-blue-400"
                            : "bg-white/5 text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {pm.category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0d1428] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0d1428] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                      Organization / Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex University / TechCorp"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-[#0d1428] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0d1428] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">
                    Partnership Goals / Message
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your team size, student batch, or co-marketing objectives..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0d1428] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#38bdf8] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-xl font-black uppercase text-xs tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-[#2563eb] to-[#0284c7] hover:brightness-110 text-white shadow-blue-500/25"
                >
                  <Sparkles className="w-4 h-4 text-[#e7ff3d]" />
                  <span>SUBMIT PARTNERSHIP APPLICATION</span>
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
