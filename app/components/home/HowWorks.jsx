import {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import {HeroProduct1, HeroProduct2, HeroProduct3} from '~/assets/images';

const STEPS = [
  {
    word: 'curate',
    image: HeroProduct1,
    desc: 'We handpick every piece from trusted artisans and vintage sources around the world.',
  },
  {
    word: 'craft',
    image: HeroProduct2,
    desc: 'Each lamp is carefully restored, refined, and prepared to meet our quality standards.',
  },
  {
    word: 'deliver',
    image: HeroProduct3,
    desc: 'Your order arrives safely packaged, ready to illuminate your space from day one.',
  },
];

const STEP_DELAY = 2500;
const ITEM_HEIGHT = 140;

function getItem(index) {
  const len = STEPS.length;
  return STEPS[((index % len) + len) % len];
}

export default function HowWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);
  const isAnimating = useRef(false);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating.current) return;
      advance();
    }, STEP_DELAY);
    return () => clearInterval(interval);
  }, []);

  const advance = () => {
    if (!listRef.current || isAnimating.current) return;
    isAnimating.current = true;

    gsap.to(listRef.current, {
      y: `-=${ITEM_HEIGHT}`,
      duration: 1.1,
      ease: 'power4.inOut',
      onComplete: () => {
        // Instantly hide, reset, update state, then fade back in
        gsap.set(listRef.current, {opacity: 0, y: 0});
        setActiveIndex((prev) => (prev + 1) % STEPS.length);
        // Tiny delay lets React re-render the new slots before we show them
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            gsap.to(listRef.current, {
              opacity: 1,
              duration: 0,
            });
            isAnimating.current = false;
          });
        });
      },
    });
  };

  const slots = [
    getItem(activeIndex - 1),
    getItem(activeIndex),
    getItem(activeIndex + 1),
    getItem(activeIndex + 2),
  ];

  return (
    <section
      id="howworks-section"
      className="w-full bg-[#f0ece4] flex flex-col items-center px-16 py-24 mx-auto"
    >
      <div className="flex flex-row items-start gap-0">
        {/* ── Left: "We" + image ── */}
        <div
          className="flex flex-row items-center gap-6 shrink-0"
          style={{width: 380, height: ITEM_HEIGHT * 3}}
        >
          <span
            className="font-display text-black font-normal leading-none self-center"
            style={{fontSize: 120}}
          >
            We
          </span>
          <div
            className="overflow-hidden rounded-lg bg-gray-200 shrink-0 self-center"
            style={{width: 120, height: 160}}
          >
            <img
              src={getItem(activeIndex).image}
              alt={getItem(activeIndex).word}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>
        </div>

        {/* ── Right: looping word carousel ── */}
        {/* Clip window: 3 rows — prev / active / next */}
        <div className="overflow-hidden" style={{height: ITEM_HEIGHT * 3}}>
          <div ref={listRef} className="flex flex-col">
            {slots.map((step, i) => {
              const isActive = i === 1; // slot 1 is always the active center
              return (
                <div
                  key={`${step.word}-${i}`}
                  className="flex items-center shrink-0"
                  style={{height: ITEM_HEIGHT}}
                >
                  <span
                    className="font-display font-normal leading-none"
                    style={{
                      fontSize: 120,
                      color: isActive ? '#111111' : '#c8c4bc',
                    }}
                  >
                    {step.word}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6" style={{marginLeft: 380}}>
        <p
          key={activeIndex}
          className="font-sans text-sm text-gray-500 max-w-xs leading-relaxed"
          style={{animation: 'hwFadeIn 0.4s ease'}}
        >
          {getItem(activeIndex).desc}
        </p>
      </div>

      <style>{`
        @keyframes hwFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
