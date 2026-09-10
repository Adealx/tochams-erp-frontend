import Image from "next/image";
import HeroSection from "./HeroSection";

export default function LeftPanel() {
  return (
    <section
      className="
        relative
        hidden
        min-h-screen
        overflow-hidden
        text-white
        lg:flex
        lg:flex-col
      "
    >
      {/* =====================================================
          CORPORATE BUILDING BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0">

        <Image
          src="/images/tochams-corporate-building.png"
          alt=""
          fill
          priority
          sizes="56vw"
          className="
            object-cover
            object-right
          "
        />

        {/* =================================================
            LIGHT OVERLAY
            Keeps the building clearly visible
        ================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-[#04152F]/40
          "
        />

        {/* =================================================
            LEFT TEXT PROTECTION
            Darker on the left, transparent on the right
        ================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#03152F]/85
            via-[#062D65]/35
            to-transparent
          "
        />

        {/* =================================================
            SUBTLE BOTTOM FADE
        ================================================== */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-1/3
            bg-gradient-to-t
            from-[#02132D]/70
            to-transparent
          "
        />

        {/* =================================================
            SUBTLE CORPORATE GRID
        ================================================== */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          flex-col
          px-10
          py-8
          xl:px-14
          xl:py-10
        "
      >
        <HeroSection />
      </div>

    </section>
  );
}