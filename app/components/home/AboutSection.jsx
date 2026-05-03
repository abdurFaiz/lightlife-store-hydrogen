export default function AboutSection() {
  return (
    <section
      id="about-section"
      className="min-h-screen bg-white px-6 py-16 flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Grid: 3 columns — left images | center text | right images */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-8 items-center">
          {/* ── Left column: top + middle + bottom blocks ── */}
          <div className="flex flex-col gap-6">
            {/* Top-left: offset right */}
            <div className="flex justify-end">
              <div className="w-40 h-40 bg-gray-200 rounded-sm" />
            </div>
            {/* Middle-left: offset left */}
            <div className="flex justify-start">
              <div className="w-40 h-40 bg-gray-200 rounded-sm" />
            </div>
            {/* Bottom-left: offset right */}
            <div className="flex justify-end">
              <div className="w-40 h-40 bg-gray-200 rounded-sm" />
            </div>
          </div>

          {/* ── Center column: text ── */}
          <div className="flex flex-col gap-4 text-center max-w-md px-4">
            <h2 className="font-display text-gray-900 leading-tight text-5xl">
              We don't sell lamps. <br /> We sell the feeling of being
              home.{' '}
            </h2>
            <p className="font-sans text-sm capitalize text-gray-700 leading-tight">
              We made these lamps for all the reasons light is needed. And we
              made them with love, so even the smallest corner of your home
              feels like it belongs to you.
            </p>
          </div>

          {/* ── Right column: top + middle + bottom blocks ── */}
          <div className="flex flex-col gap-6">
            {/* Top-right: offset left */}
            <div className="flex justify-start">
              <div className="w-40 h-40 bg-gray-200 rounded-sm" />
            </div>
            {/* Middle-right: offset right */}
            <div className="flex justify-end">
              <div className="w-40 h-40 bg-gray-200 rounded-sm" />
            </div>
            {/* Bottom-right: offset left */}
            <div className="flex justify-start">
              <div className="w-40 h-40 bg-gray-200 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
