export interface OrbitLabel {
  /** Visible text. */
  readonly label: string;
  readonly href: string;
  /**
   * Angle in degrees along the primary orbit arc, measured from the apex.
   * Negative is left of centre. Node and label positions are derived from
   * this so a label can never drift away from its node.
   */
  readonly angle: number;
}

export interface CurriculumModule {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly weeks: string;
  /** Accent used for the title, node and glow. */
  readonly accent: "cyan" | "pink";
  /** True for modules that still need to come from the client. */
  readonly placeholder?: boolean;
}

export interface PartnerSlot {
  readonly id: string;
  /** Placeholder label. Replace with a real logo once assets are supplied. */
  readonly name: string;
  /** Path to the logo image. */
  readonly image?: string;
}

export interface AudienceSlide {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly href: string;
  /** Image specific to this slide. */
  readonly image?: string;
  /** Hue rotation applied to the shared wave graphic for this slide. */
  readonly waveHue: number;
  /** True for copy that still needs to come from the client. */
  readonly placeholder?: boolean;
}

export interface FooterColumn {
  readonly id: string;
  readonly links: ReadonlyArray<{
    readonly label: string;
    readonly href: string;
  }>;
}
