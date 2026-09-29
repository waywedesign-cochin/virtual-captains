"use client";

import PhoneInput, { type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";

/**
 * International phone input — every country with its flag and dialling code,
 * searchable country list, as-you-type formatting and libphonenumber-based
 * validation (react-phone-number-input). The value is an E.164 string, e.g.
 * "+919876543210", or undefined when empty.
 *
 * Use `isValidPhoneNumber` from "react-phone-number-input" to validate.
 */
export default function PhoneField({
  id,
  value,
  onChange,
  invalid = false,
  tone = "light",
  describedBy,
}: {
  id?: string;
  value: Value | undefined;
  onChange: (value: Value | undefined) => void;
  invalid?: boolean;
  tone?: "light" | "dark";
  describedBy?: string;
}) {
  const dark = tone === "dark";

  const box = dark
    ? `rounded-xl border bg-white/4 px-4 py-2.5 text-sm text-white focus-within:bg-white/[0.07] focus-within:ring-2 ${
        invalid
          ? "border-[#ff5c5c] focus-within:ring-[#ff5c5c]/20"
          : "border-white/12 focus-within:border-[#38bdf8] focus-within:ring-[#38bdf8]/20"
      }`
    : `rounded-lg border bg-white px-3.5 py-1.5 text-[14px] text-[#101010] ${
        invalid ? "border-[#ff5c5c]" : "border-black/15 focus-within:border-[#3478e5]"
      }`;

  return (
    <PhoneInput
      international
      defaultCountry="IN"
      countryCallingCodeEditable={false}
      value={value}
      onChange={onChange}
      className={`vc-phone flex w-full min-w-0 items-center gap-2.5 transition-colors ${box} ${dark ? "vc-phone--dark" : ""}`}
      numberInputProps={{
        id,
        "aria-invalid": invalid,
        "aria-describedby": describedBy,
        autoComplete: "tel",
        className: `min-w-0 flex-1 bg-transparent py-1 outline-none ${
          dark ? "placeholder:text-white/30" : "placeholder:text-slate-400"
        }`,
      }}
    />
  );
}
