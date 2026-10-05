/** Root loading UI — the Suspense fallback shown while a route segment loads. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-svh flex-1 flex-col items-center justify-center bg-[#030612] text-white"
    >
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 rounded-full border-2 border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#F3FC00] border-r-[#D08817]" />
      </div>
      <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.25em] text-white/50">
        Loading
      </p>
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
