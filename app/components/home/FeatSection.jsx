import {useEffect, useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {
  HeroImageLight,
  HeroImageLight2,
  HeroImageLight3,
  HeroProduct1,
  HeroProduct2,
  HeroProduct3,
} from '~/assets/images';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 'slide-1',
    image: HeroImageLight,
    title: 'Simple Bloomer',
    desc: 'Some things are better imperfect. Each shade begins as a flat slab of clay, draped by hand, shaped by pressure, marked by time.',
    product: {image: HeroProduct1, name: 'Simple Bloomer', price: 'IDR 225 K'},
  },
  {
    id: 'slide-2',
    image: HeroImageLight2,
    title: 'Handmade Curation',
    desc: 'Behind every lamp is a pair of hands that chose every curve, every finish, every detail on purpose. Thats what curation means to us.',
    product: {image: HeroProduct2, name: 'Pool Pendant', price: 'IDR 299 K'},
  },
  {
    id: 'slide-3',
    image: HeroImageLight3,
    title: 'Best Value',
    desc: 'We believe a well-made lamp shouldnt cost a compromise. Considered design, honest materials, a price that respects you.',
    product: {image: HeroProduct3, name: 'Nilson Extended', price: 'IDR 299 K'},
  },
];

export default function FeatSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const slides = document.querySelectorAll('.feat-slide');

      slides.forEach((slide, index) => {
        const content = slide.querySelector('.feat-content');

        // Animation 1: Scroll down untuk semua content
        const scrollAnim = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            start: index === 0 ? '33vh top' : 'top top', // slide 1 mulai dari 1/3 viewport
            end: 'bottom top',
            scrub: 1,
            markers: false, // set true untuk debug
          },
        });

        scrollAnim.to(content, {
          y: window.innerHeight,
          ease: 'none',
        });

        // Animation 2: Slide down dari atas untuk slide 2+ (waterfall effect, no fade)
        if (index > 0) {
          const prevSlide = slides[index - 1];

          const waterfallAnim = gsap.timeline({
            scrollTrigger: {
              trigger: prevSlide,
              start: '10% top',
              end: '80% top',
              scrub: 1,
              markers: false,
            },
          });

          // Muncul dari atas (waterfall) tanpa fade
          waterfallAnim.fromTo(
            content,
            {
              y: -100, // mulai dari atas (di luar viewport)
            },
            {
              y: 0, // turun ke posisi normal
              ease: 'none',
            },
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="feat-section">
      {/* ── Section header ── */}
      <div className="w-full flex flex-col items-center text-center py-16 bg-white">
        <h2 className="font-display text-5xl text-black tracking-tight capitalize leading-normal">
          A presence you feel before you see
        </h2>
        <p className="text-sm text-gray-400 leading-snug">
          Designed to be experienced, not just looked at.
        </p>
      </div>

      {/* ── Slides ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="feat-slide relative w-full h-[200vh]"
        >
          {/* Sticky container */}
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Background image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/25 to-transparent" />

            {/* Content */}
            <div
              className={`feat-content absolute inset-x-0 w-full ${i === 0 ? 'top-1/3' : 'top-0'}`}
              style={{
                opacity: 1, // always visible, no fade
                transform: 'translateY(0)',
              }}
            >
              <div className="w-full px-10 pt-8 flex flex-row justify-between items-start">
                {/* Left */}
                <div className="flex flex-col gap-3 max-w-sm">
                  <h3 className="font-display text-white text-5xl tracking-tighter leading-tight">
                    {slide.title}
                  </h3>
                  <p className="font-sans text-white/85 text-sm tracking-tight leading-relaxed">
                    {slide.desc}
                  </p>
                </div>

                {/* Right */}
                <div className="p-2 bg-white/20 backdrop-blur-lg  shrink-0">
                  <div className="relative">
                    <img
                      src={slide.product.image}
                      alt={slide.product.name}
                      className="w-[140px] h-[180px] object-cover"
                    />
                    <div className="absolute bottom-2 left-2 flex flex-col">
                      <span className="font-display text-xs text-black drop-shadow capitalize">
                        {slide.product.name}
                      </span>
                      <span className="font-sans font-semibold text-xs text-black/80 capitalize">
                        {slide.product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
