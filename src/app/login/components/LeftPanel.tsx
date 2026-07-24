import HeroSection from "./HeroSection";

export default function LeftPanel() {
  return (
    <section
      className="
        relative
        hidden
        overflow-hidden
        bg-gradient-to-br
        from-[#0B2A83]
        via-[#1140C7]
        to-[#1D4ED8]
        px-14
        py-12
        text-white
        lg:flex
        lg:flex-col
        lg:justify-center
      "
    >
      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="
            absolute
            -left-56
            -top-56
            h-[700px]
            w-[700px]
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-250px]
            right-[-250px]
            h-[650px]
            w-[650px]
            rounded-full
            bg-cyan-300/10
            blur-3xl
          "
        />

      </div>

      <div className="relative z-10">
        <HeroSection />
      </div>

    </section>
  );
}