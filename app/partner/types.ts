export interface PartnershipModel {
  id: string;
  category: string;
  title: string;
  badge?: string;
  isPopular?: boolean;
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
