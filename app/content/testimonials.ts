export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Client logo (public/clientlogos/) shown in the avatar circle */
  logo?: string;
  /** "cover" for logos on a solid square background, else "contain" */
  logoFit?: "contain" | "cover";
  /** Optional headshot — takes the circle over the logo */
  photo?: string;
};

/** Client testimonials shared by the home Endorsement and SalesX sections. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Roshna was instrumental in rebuilding and scaling our team — showing incredible ability to identify top talent and foster a culture of excellence.",
    name: "Rijaz Sulaiman",
    role: "Founder & Managing Director, ThoughtBox Online Services Pvt Ltd",
    logo: "/clientlogos/thoughtbox.webp",
  },
  {
    quote:
      "Roshna's team successfully delivered a comprehensive 'Campus to Corporate' training program for Cyncly's cohort of recent graduates. The program was thoughtfully structured and executed with excellence, addressing both technical and soft skill development. I confidently recommend Virtual Captains for any organizational training requirements.",
    name: "Madhura Kulkarni",
    role: "Cyncly",
    logo: "/clientlogos/Cyncly-logo.png",
  },
  {
    quote:
      "Perfect guide for lead generation and sales consulting. Her practical approach contributed to improving our sales skills.",
    name: "Kishore Thanisserry & Anil P",
    role: "GMap LLC",
    logo: "/clientlogos/GMap.png",
  },
  {
    quote:
      "We had an excellent experience working with Virtual Captains for our lead generation initiatives. Their team quickly understood our goals, refined our targeting strategy, and helped us build a consistent flow of qualified leads. Thanks to their support, we were able to scale our outreach efficiently and focus more on conversions rather than chasing leads.",
    name: "MoonHive",
    role: "Lead Generation Client",
    logo: "/clientlogos/MoonHive -Logo.jpg",
  },
  {
    quote:
      "We collaborated with Virtual Captains for a marketing program, and must say, their professionalism and expertise truly stood out. From the planning to flawless execution, their team's attention to detail and strategic mindset ensured smooth progress every step of the way. Communication remained consistently prompt and clear, making the entire collaboration a seamless experience.",
    name: "Assistant Manager",
    role: "KIED",
    logo: "/clientlogos/KIED.jpg",
  },
  {
    quote:
      "I am pleased to write this letter to express my appreciation for Roshna's exceptional sales capabilities. Roshna consistently demonstrates remarkable skills in sales and marketing that have helped her to incubate Virtual Captains successfully.",
    name: "Deepak Nair",
    role: "25+ years of international experience in IT, Telecom, Oil & Gas, Retail, Media and Education",
  },
  {
    quote:
      "I highly recommend Roshna Saffar for the position of Sales Strategist. Her innovative strategies and proven track record in driving sales growth make her recommended for this role.",
    name: "Vismaya Biju",
    role: "Director & Co-Founder, Southern Sages Pvt Ltd",
    logo: "/clientlogos/Southern Sages.png",
  },
  {
    quote:
      "We have used Roshna's Sales training for our ISR and SMB Sales teams. She gets into the core of sales and then builds from there. Most of the concepts are easy to follow and track. Teams have given a very positive feedback and I would recommend her services if someone is looking for a Virtual Sales team.",
    name: "Jose Prakash",
    role: "Skylark Information Technologies Pvt Ltd",
    logo: "/partners/SKYLARK.png",
  },
  {
    quote:
      "Roshna is a very hardworking, talented person, who goes the extra mile to get work settled. She is not only a good team worker but also a great team leader who has the capacity to mold and mend her team mates and colleagues. Her selling skills and her straightforward character are an asset to any organization. Wishing Roshna a bright future.",
    name: "TS Ramaswamy",
    role: "LCC",
  },
  {
    quote:
      "I highly recommend Roshna Saffar's sessions to anyone seeking to enhance their understanding of key business concepts. Roshna's comprehensive coverage of topics including Market Research, Customer Behavior, Market Strategy, Sales, Branding, Digital Marketing, and Customer Relationship was truly insightful and invaluable.",
    name: "Benedict William Johns",
    role: "KIED",
    logo: "/clientlogos/KIED.jpg",
  },
  {
    quote:
      "We have used Roshna's Sales training for our Sales teams, and it has been highly effective. She starts with the fundamentals of sales and builds from there, making the concepts easy to follow and apply. Our teams have given very positive feedback, and I highly recommend her services to anyone looking for a Virtual Sales team. For those struggling to maintain sales momentum, Virtual Captains offers expert support.",
    name: "Wilfred Nilober",
    role: "Skylark Information Technologies Pvt Ltd",
    logo: "/partners/SKYLARK.png",
  },
];
