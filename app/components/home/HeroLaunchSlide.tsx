import Image from "next/image";
import type { CSSProperties } from "react";
import { Poppins } from "next/font/google";

// The launch poster is set in Poppins; the rest of the site uses DM Sans.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Second hero slide: SalesX launch by the Hon'ble Minister.
 *
 * Desktop recreates the launch poster: the poster's own backdrop (text
 * removed, minister kept) covers the whole slide, anchored bottom-right, and
 * the copy is a responsive column in the space left of the minister. Sizes
 * use min(cqw, cqh) so text scales with whichever side of the screen is
 * tighter.
 *
 * Mobile/tablet: the poster's centre backdrop, headline block centred at the
 * top, the minister standing in from the bottom right and the launch card
 * over the bottom left, echoing the poster.
 *
 * Reveal animations are CSS (globals.css, "Hero launch slide") and replay
 * whenever `active` flips on via the `data-active` attribute.
 */

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function HeroLaunchSlide({ active }: { active: boolean }) {
  return (
    <div
      data-active={active}
      className={`launch-slide absolute inset-0 overflow-hidden bg-[#06215f] ${poppins.className}`}
    >
      {/* ================= DESKTOP ================= */}
      {/* Backdrop fills the slide ("cover"), pinned bottom-right so the
          minister is never cropped; the copy column takes the space to his
          left. The minister is ~36% of the artwork's width, so the column's
          right edge is that share of the scaled image. */}
      <div className="absolute inset-0 hidden [container-type:size] lg:block">
        <div className="launch-photo absolute inset-0">
          <Image
            src="/home/salesx-launch-bg.webp"
            alt="Shri. P. K. Kunhalikutty, Hon'ble Minister for Industries & Information Technology, Kerala"
            fill
            sizes="100vw"
            className="object-cover object-[right_bottom]"
          />
        </div>
        <div aria-hidden="true" className="launch-sweep pointer-events-none absolute inset-0" />

        {/* Centre column: centred at 47.5% of the screen like the poster, but
            pulled left on narrower laptops so the logo never meets the
            minister (whose width is max(36cqw, 64cqh)). */}
        <div
          className="absolute inset-y-0 z-10 flex w-[min(52cqw,92cqh)] -translate-x-1/2 flex-col items-center pt-[clamp(96px,14cqh,150px)] pb-[clamp(150px,25cqh,260px)] text-center"
          style={{ left: "min(47.5cqw, calc(104cqw - max(36cqw, 64cqh) - min(19cqw, 34cqh)))" }}
        >
          <h2 className="launch-in text-[min(3.4cqw,6.2cqh)] font-semibold uppercase leading-[1.08] text-white" style={d(0)}>
            The Sales Game Is
            <br />
            About To Change
          </h2>
          <p className="launch-in mt-[min(1.4cqw,2.4cqh)] text-[min(1.1cqw,2cqh)] uppercase tracking-[0.3em] text-white/90" style={d(90)}>
            A New Era of Sales Capability Begins
          </p>

          <div className="launch-in flex flex-1 flex-col items-center justify-center pt-[3cqh]" style={d(180)}>
            <Image
              src="/salesx/salesx-logo.png"
              alt="SalesX by Virtual Captains"
              width={846}
              height={232}
              className="h-auto w-[min(38cqw,68cqh)]"
            />
            <span aria-hidden="true" className="mt-[2.4cqh] block h-px w-[min(8cqw,14cqh)] bg-linear-to-r from-transparent via-[#4d82f5] to-transparent" />
            <p className="launch-in mt-[2.6cqh] text-[min(1.3cqw,2.3cqh)] uppercase leading-[1.7] tracking-[0.45em] text-white" style={d(260)}>
              Smarter Insights.
              <br />
              Stronger Sales Tomorrow.
            </p>
          </div>
        </div>

        {/* bottom row stays left-aligned under the navbar logo */}
        <div className="launch-in absolute bottom-[clamp(44px,7cqh,80px)] left-[clamp(32px,4.3cqw,96px)] z-10 flex items-stretch gap-[min(2.5cqw,4cqh)] text-left" style={d(340)}>
            <p className="self-center whitespace-nowrap text-[min(2cqw,3.6cqh)] uppercase leading-[1.2] text-white">
              Join Us As We Unveil
              <br />
              <span className="font-semibold">A New Chapter</span>
            </p>
            <span aria-hidden="true" className="w-px bg-linear-to-b from-transparent via-[#4d82f5] to-transparent" />
            <div>
              <p className="w-[min(15cqw,27cqh)] bg-linear-to-r from-[#2563eb] via-[#2563eb] to-[#2563eb]/0 px-[0.9em] py-[0.3em] text-[min(0.95cqw,1.7cqh)] uppercase text-white">
                Launching By
              </p>
              <p className="mt-[min(1cqw,1.8cqh)] whitespace-nowrap text-[min(2cqw,3.6cqh)] font-semibold leading-none text-white">
                Shri. P. K. Kunhalikutty
              </p>
              <p className="mt-[min(0.7cqw,1.2cqh)] text-[min(1cqw,1.8cqh)] leading-[1.35] tracking-wide text-white/90">
                Hon&rsquo;ble. Minister Industries &amp; Information
                <br />
                Technology Kerala
              </p>
            </div>
        </div>
      </div>

      {/* ================= MOBILE / TABLET ================= */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/home/salesx-launch-bg-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* minister cut-out (transparent background), bottom right */}
        <div className="launch-photo absolute -right-[4%] bottom-0 h-[48%] w-[88%] sm:w-[66%]">
          <Image
            src="/home/minister-cutout.webp"
            alt="Shri. P. K. Kunhalikutty, Hon'ble Minister for Industries & Information Technology, Kerala"
            fill
            sizes="(min-width: 640px) 66vw, 88vw"
            className="object-contain object-right-bottom drop-shadow-[0_0_40px_rgba(77,130,245,0.35)]"
          />
        </div>
        {/* darkens the bottom-left so the launch card reads over the photo */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(to_top,rgba(3,12,40,0.92)_0%,rgba(3,12,40,0.55)_55%,transparent_100%)]" />

        <div className="relative z-10 flex h-full flex-col items-center px-5 pb-[clamp(44px,7vh,64px)] pt-[clamp(88px,11vh,130px)] text-center sm:px-10">
          <h2 className="launch-in text-[clamp(1.55rem,6.5vw,2.6rem)] font-semibold uppercase leading-[1.08] text-white" style={d(0)}>
            The Sales Game Is
            <br />
            About To Change
          </h2>
          <p className="launch-in mt-2 text-[9px] uppercase tracking-[0.28em] text-white/85 min-[400px]:text-[10px] sm:text-xs" style={d(90)}>
            A New Era of Sales Capability Begins
          </p>
          <Image
            src="/salesx/salesx-logo.png"
            alt="SalesX by Virtual Captains"
            width={846}
            height={232}
            className="launch-in mt-[clamp(14px,3vh,28px)] h-auto w-[min(68vw,320px)]"
            style={d(180)}
          />
          <span aria-hidden="true" className="mt-3 block h-px w-16 bg-linear-to-r from-transparent via-[#4d82f5] to-transparent" />
          <p className="launch-in mt-3 text-[10px] uppercase leading-[1.8] tracking-[0.4em] text-white sm:text-xs" style={d(260)}>
            Smarter Insights.
            <br />
            Stronger Sales Tomorrow.
          </p>

          {/* launch card, bottom left over the photo */}
          <div className="launch-in mt-auto self-start text-left" style={d(340)}>
            <p className="text-[13px] uppercase leading-tight text-white sm:text-base">
              Join Us As We Unveil
              <br />
              <span className="font-semibold">A New Chapter</span>
            </p>
            <span aria-hidden="true" className="my-3 block h-px w-24 bg-linear-to-r from-[#4d82f5] to-transparent" />
            <p className="inline-block w-36 bg-linear-to-r from-[#2563eb] via-[#2563eb] to-[#2563eb]/0 px-2.5 py-0.5 text-[10px] uppercase text-white sm:text-xs">
              Launching By
            </p>
            <p className="mt-1.5 text-[clamp(1.1rem,4.8vw,1.6rem)] font-semibold leading-tight text-white">
              Shri. P. K. Kunhalikutty
            </p>
            <p className="mt-0.5 max-w-[210px] text-[11px] leading-snug text-white/85 sm:max-w-none sm:text-[13px]">
              Hon&rsquo;ble. Minister Industries &amp; Information Technology Kerala
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
