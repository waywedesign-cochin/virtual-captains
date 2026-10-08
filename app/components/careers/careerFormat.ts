import {
  EMPLOYMENT_TYPE_LABEL,
  WORKPLACE_TYPE_LABEL,
  type CareerSalary,
  type CareerSummary,
} from "@/sanity/lib/types";

export function formatPostedDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "Full-time · Hybrid" */
export function jobTypeLine(job: Pick<CareerSummary, "employmentType" | "workplaceType">) {
  return [EMPLOYMENT_TYPE_LABEL[job.employmentType], WORKPLACE_TYPE_LABEL[job.workplaceType]]
    .filter(Boolean)
    .join(" · ");
}

const UNIT_LABEL = { YEAR: "year", MONTH: "month", HOUR: "hour" } as const;

/** "₹6L – ₹9L / year", or null when the salary is hidden or incomplete. */
export function formatSalary(salary?: CareerSalary): string | null {
  if (!salary?.showOnSite || (!salary.min && !salary.max)) return null;
  const currency = salary.currency || "INR";
  const fmt = new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const range =
    salary.min && salary.max
      ? `${fmt.format(salary.min)} – ${fmt.format(salary.max)}`
      : fmt.format((salary.min || salary.max)!);
  return `${range} / ${UNIT_LABEL[salary.unit ?? "YEAR"]}`;
}
