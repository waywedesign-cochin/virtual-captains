import type { PortableTextComponents } from "@portabletext/react";

/** Same rich-text styling as the News & Blog article renderers. */
export const careerPortableText: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base sm:text-lg text-white/75 leading-[1.85] font-normal">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="font-sans text-xl sm:text-2xl font-normal tracking-tight pt-4 text-white">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans text-xl sm:text-2xl font-normal tracking-tight pt-4 text-white">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-sans text-lg font-medium tracking-tight pt-2 text-white">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <div className="p-6 sm:p-7 rounded-2xl bg-white/5 border border-white/10 border-l-4 border-l-[#1d4ed8] my-6">
        <p className="text-sm sm:text-base text-white italic leading-relaxed font-sans">{children}</p>
      </div>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-3 my-5 pl-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="space-y-3 my-5 pl-6 list-decimal marker:text-[#8fd0ff] text-base sm:text-lg text-white/75">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-base sm:text-lg text-white/75 leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-3 shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#8fd0ff] underline underline-offset-4 hover:text-[#38bdf8] transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.url ? (
        <figure className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt={value.alt || ""}
            loading="lazy"
            className="w-full rounded-2xl border border-white/10"
          />
        </figure>
      ) : null,
  },
};
