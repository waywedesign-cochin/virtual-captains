export interface PartnershipModel {
  id: string;
  category: string;
  title: string;
  badge?: string;
  isPopular?: boolean;
  /** Index number and verb, e.g. "01" + "Educate" */
  number: string;
  verb: string;
  /** One-line promise shown under the partner type */
  headline: string;
  description: string;
  features: string[];
  ctaText: string;
  iconType: "academic" | "corporate" | "brand";
  themeColor: string;
}

export interface PartnerInquiry {
  fullName: string;
  email: string;
  organization: string;
  phone: string;
  message: string;
  partnershipId: string;
}
