import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid corporate email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="relative overflow-hidden my-20 rounded-2xl border border-white/10 bg-[#0e1117] p-8 sm:p-12 lg:p-16">
      {/* Background radial gradient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
          <span>The Virtual Captains Dispatch</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
          Stay ahead of the enterprise sales frontier.
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl mx-auto">
          Deep dives into sales methodologies, cognitive negotiation, and tactical deal execution delivered directly from our practice.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">
              You're on the list! Check your inbox for our latest editorial dispatch.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your work email"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 text-left pl-1">{error}</p>
            )}
            <p className="text-xs text-neutral-400">
              No sponsored fluff or daily spam. Unsubscribe at any moment.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
