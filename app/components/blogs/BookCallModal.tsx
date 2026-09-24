import React, { useState } from "react";
import { X, Calendar, Clock, CheckCircle2, ArrowRight } from "lucide-react";

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookCallModal: React.FC<BookCallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "$10k - $25k",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/6 text-[#141414]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-[#737373] hover:text-[#141414] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "form" ? (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A4A4A4]">
                <Calendar className="w-3.5 h-3.5" />
                <span>30-Min Discovery Session</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#141414]">
                Book a consultation
              </h3>
              <p className="text-sm text-[#737373]">
                Discuss your growth roadmap, team performance, and strategic
                sales objectives directly with the Virtual Captains team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#141414]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9F8F6] border border-black/10 focus:border-[#141414] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#141414]">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="elena@company.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9F8F6] border border-black/10 focus:border-[#141414] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#141414]">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Studio or Venture"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9F8F6] border border-black/10 focus:border-[#141414] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#141414]">
                    Target Investment
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9F8F6] border border-black/10 focus:border-[#141414] focus:outline-none transition-colors"
                  >
                    <option>&lt; $10k</option>
                    <option>$10k - $25k</option>
                    <option>$25k - $50k</option>
                    <option>$50k+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#141414]">
                  Brief Project Description
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Tell us what you are looking to build or redesign..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F9F8F6] border border-black/10 focus:border-[#141414] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#141414] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Confirm Call Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#141414] mx-auto" />
            <h3 className="font-serif text-2xl font-normal text-[#141414]">
              Request Received
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] max-w-xs mx-auto">
              Thank you, {formData.name}. We have sent calendar invitation
              details to{" "}
              <span className="font-medium text-[#141414]">
                {formData.email}
              </span>
              .
            </p>
            <button
              onClick={() => {
                setStep("form");
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-[#141414] text-white text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
