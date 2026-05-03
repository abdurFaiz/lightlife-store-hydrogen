import {useEffect, useRef, useState, useCallback} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {
  HeroProduct1,
  HeroProduct2,
  HeroProduct3,
  HeroImageLight,
  HeroImageLight2,
  HeroImageLight3,
} from '~/assets/images';

gsap.registerPlugin(ScrollTrigger);

const GAP = 14;

const CARDS = [
  {
    id: 'card-1',
    image: HeroImageLight,
    username: 'polonaamy',
    videoUrl:
      'https://cdn.shopify.com/videos/c/o/v/8e7aa04fab8749b1883ec86d4543a7cb.mp4',
    productImage: HeroProduct1,
    productName: 'Nilston Extended',
    productPrice: 'IDR 400K',
  },
  {
    id: 'card-2',
    image: HeroImageLight2,
    username: 'alexislconway',
    videoUrl:
      'https://cdn.shopify.com/videos/c/o/v/b5b410bae61f4b5db61f7cd3e949219d.mp4',
    productImage: HeroProduct2,
    productName: 'Vintage Brass Lamp',
    productPrice: 'IDR 189K',
  },
  {
    id: 'card-3',
    image: HeroImageLight3,
    username: 'username3',
    videoUrl:
      'https://cdn.shopify.com/videos/c/o/v/63cdaad57b6247cd8fbac28f05be40c8.mp4',
    productImage: HeroProduct3,
    productName: 'Modern Ceramic',
    productPrice: 'IDR 299K',
  },
];

// Returns card width in px based on current viewport
function getCardWidth() {
  if (typeof window === 'undefined') return 500;
  if (window.innerWidth < 640) return 280;
  if (window.innerWidth < 1024) return 360;
  return 500;
}

// Returns card height in px based on current viewport
function getCardHeight() {
  if (typeof window === 'undefined') return 700;
  if (window.innerWidth < 640) return 420;
  if (window.innerWidth < 1024) return 540;
  return 700;
}

// Attach video hover + play/pause behaviour imperatively to a card DOM node
function attachCardBehaviour(cardEl) {
  const video = cardEl.querySelector('.card-video');
  const img = cardEl.querySelector('.card-img');
  const btn = cardEl.querySelector('.card-playbtn');
  if (!btn) return;

  const supportsHover = window.matchMedia('(hover: hover)').matches;

  function setPlayState(playing) {
    btn.setAttribute('data-playing', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    const playIcon = btn.querySelector('.card-play-icon');
    const pauseIcon = btn.querySelector('.card-pause-icon');
    if (playIcon) playIcon.style.display = playing ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = playing ? 'block' : 'none';
  }

  function showVideo() {
    if (!video) return;
    if (img) img.style.opacity = '0';
    video.style.opacity = '1';
    if (video.readyState < 2) video.load();
    video.play().then(() => setPlayState(true)).catch(() => {});
  }

  function hideVideo() {
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.style.opacity = '0';
    if (img) img.style.opacity = '1';
    setPlayState(false);
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (btn.getAttribute('data-playing') === 'true') {
      hideVideo();
    } else {
      showVideo();
    }
  });

  if (supportsHover && video) {
    cardEl.addEventListener('mouseenter', () => {
      if (btn.getAttribute('data-playing') !== 'true') showVideo();
    });
    cardEl.addEventListener('mouseleave', () => {
      if (btn.getAttribute('data-playing') !== 'true') hideVideo();
    });
  }
}

// Pure card markup — no React state, safe to cloneNode
function CardInner({card}) {
  return (
    <>
      <img
        src={card.image}
        alt={`@${card.username}`}
        loading="lazy"
        className="card-img absolute inset-0 w-full h-full object-cover object-center"
        style={{transition: 'opacity 0.5s ease'}}
      />

      {card.videoUrl && (
        <video
          className="card-video absolute inset-0 w-full h-full object-cover object-center"
          src={card.videoUrl}
          muted
          playsInline
          loop
          preload="none"
          style={{opacity: 0, transition: 'opacity 0.5s ease'}}
        />
      )}

      {/* Top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent z-10" />

      {/* Username + play button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 z-20">
        <span
          className="font-sans text-[10px] font-medium text-white uppercase tracking-[0.08em]"
          style={{textShadow: '0 1px 4px rgba(0,0,0,0.45)'}}
        >
          @{card.username}
        </span>
        <button
          type="button"
          className="card-playbtn ml-auto flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-[10px] cursor-pointer border-0 p-0 z-30"
          aria-label="Play video"
          data-playing="false"
        >
          <svg className="card-play-icon" width="10" height="10" viewBox="0 0 10 10" fill="white" aria-hidden="true">
            <path d="M2 1.5L9 5L2 8.5V1.5Z" />
          </svg>
          <svg className="card-pause-icon" width="10" height="10" viewBox="0 0 10 10" fill="white" aria-hidden="true" style={{display: 'none'}}>
            <rect x="1.5" y="1" width="2.5" height="8" rx="0.5" />
            <rect x="6" y="1" width="2.5" height="8" rx="0.5" />
          </svg>
        </button>
      </div>

      {/* Product pill */}
      {(card.productImage || card.productName) && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-3 rounded-lg bg-white px-1.5 py-1.5">
          {card.productImage && (
            <div className="shrink-0 size-14 rounded-lg overflow-hidden bg-[#f5f1ed]">
              <img
                src={card.productImage}
                alt={card.productName || ''}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            {card.productName && (
              <span className="font-sans text-sm font-semibold text-[#1a1a1a] leading-tight truncate">
                {card.productName}
              </span>
            )}
            {card.productPrice && (
              <span className="font-sans text-xs text-[#555] leading-tight">
                {card.productPrice}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Add to cart"
            className="shrink-0 ml-auto flex items-center justify-center size-12 rounded-md bg-[#f4f4f4] hover:bg-[#e8e8e8] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 text-black"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const counterRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTransXRef = useRef(0);
  const total = CARDS.length;

  const getStep = useCallback(() => getCardWidth() + GAP, []);

  const getTranslateX = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const matrix = new DOMMatrix(window.getComputedStyle(track).transform);
    return matrix.m41;
  }, []);

  const setTranslateX = useCallback((x, animate, onDone) => {
    const track = trackRef.current;
    if (!track) return;
    if (animate) {
      gsap.to(track, {x, duration: 0.55, ease: 'power2.out', onComplete: onDone || null});
    } else {
      gsap.set(track, {x});
      if (onDone) onDone();
    }
  }, []);

  const targetXForIndex = useCallback(
    (logicalIndex) => -((total + logicalIndex) * getStep()),
    [total, getStep],
  );

  const updateCounter = useCallback(
    (idx) => {
      currentIndexRef.current = idx;
      setCurrentIndex(idx);
      if (counterRef.current) counterRef.current.textContent = `${idx + 1} / ${total}`;
    },
    [total],
  );

  const teleportToIndex = useCallback(
    (logicalIndex) => {
      const wrapped = ((logicalIndex % total) + total) % total;
      setTranslateX(targetXForIndex(wrapped), false);
      updateCounter(wrapped);
    },
    [total, setTranslateX, targetXForIndex, updateCounter],
  );

  const slideTo = useCallback(
    (logicalIndex) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      const wrapped = ((logicalIndex % total) + total) % total;
      const targetX = -((total + logicalIndex) * getStep());
      setTranslateX(targetX, true, () => {
        updateCounter(wrapped);
        setTranslateX(targetXForIndex(wrapped), false);
        isAnimatingRef.current = false;
      });
    },
    [total, getStep, setTranslateX, targetXForIndex, updateCounter],
  );

  // Sync card + wrapper dimensions on mount and resize
  const syncDimensions = useCallback(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;
    const h = getCardHeight();
    const w = getCardWidth();
    wrapper.style.height = `${h}px`;
    track.querySelectorAll('.community-card').forEach((card) => {
      card.style.width = `${w}px`;
      card.style.minWidth = `${w}px`;
      card.style.height = `${h}px`;
    });
  }, []);

  // Build clones, attach behaviour, init
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const originals = Array.from(track.querySelectorAll('.community-card'));
    if (!originals.length) return;

    // Prepend reversed clones
    [...originals].reverse().forEach((el) => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.insertBefore(clone, track.firstChild);
    });

    // Append clones
    originals.forEach((el) => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    // Attach behaviour to all cards (originals + clones)
    track.querySelectorAll('.community-card').forEach(attachCardBehaviour);

    syncDimensions();
    teleportToIndex(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resize handler
  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        syncDimensions();
        teleportToIndex(currentIndexRef.current);
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [syncDimensions, teleportToIndex]);

  // Drag / swipe
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onDown = (e) => {
      if (isAnimatingRef.current) return;
      isDraggingRef.current = true;
      startXRef.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      startTransXRef.current = getTranslateX();
      track.style.cursor = 'grabbing';
      gsap.killTweensOf(track);
    };

    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      setTranslateX(startTransXRef.current + (clientX - startXRef.current), false);
    };

    const onUp = (e) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      track.style.cursor = 'grab';
      const clientX =
        e.type === 'touchend'
          ? (e.changedTouches[0]?.clientX ?? startXRef.current)
          : e.clientX;
      const delta = clientX - startXRef.current;
      const step = getStep();
      const idx = currentIndexRef.current;
      if (Math.abs(delta) > step * 0.2) {
        slideTo(delta < 0 ? idx + 1 : idx - 1);
      } else {
        isAnimatingRef.current = true;
        setTranslateX(targetXForIndex(idx), true, () => {
          isAnimatingRef.current = false;
        });
      }
    };

    const preventDrag = (e) => e.preventDefault();

    track.addEventListener('mousedown', onDown);
    track.addEventListener('touchstart', onDown, {passive: true});
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive: true});
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    track.addEventListener('dragstart', preventDrag);

    return () => {
      track.removeEventListener('mousedown', onDown);
      track.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      track.removeEventListener('dragstart', preventDrag);
    };
  }, [getStep, getTranslateX, setTranslateX, slideTo, targetXForIndex]);

  // ScrollTrigger entrance animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(
      {isMobile: '(max-width: 767px)', reduceMotion: '(prefers-reduced-motion: reduce)'},
      (ctx) => {
        const {isMobile, reduceMotion} = ctx.conditions;
        if (reduceMotion) return;

        const dur = isMobile ? 0.6 : 0.8;
        const startPos = isMobile ? 'top 85%' : 'top 80%';
        const yOffset = isMobile ? 20 : 30;
        const xOffset = isMobile ? -15 : -20;

        [
          {sel: '.anim-eyebrow', from: {opacity: 0, y: 20}, d: 0.6},
          {sel: '.anim-heading', from: {opacity: 0, y: yOffset}, d: dur},
          {sel: '.anim-body',    from: {opacity: 0, y: 20},     d: dur},
          {sel: '.anim-controls', from: {opacity: 0, x: xOffset}, d: dur},
        ].forEach(({sel, from, d}) => {
          const el = section.querySelector(sel);
          if (!el) return;
          gsap.from(el, {
            ...from,
            duration: d,
            ease: 'power2.out',
            scrollTrigger: {trigger: el, start: startPos, toggleActions: 'play none none none'},
          });
        });

        const wrapper = section.querySelector('.community-track-wrapper');
        if (wrapper) {
          const cards = wrapper.querySelectorAll('.community-card:not([aria-hidden])');
          if (cards.length) {
            gsap.from(cards, {
              opacity: 0,
              x: isMobile ? 50 : 80,
              duration: dur,
              stagger: isMobile ? 0.1 : 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrapper,
                start: isMobile ? 'top 80%' : 'top 75%',
                toggleActions: 'play none none none',
              },
            });
          }
        }
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full overflow-hidden bg-white"
    >
      <div className="flex flex-col md:flex-row w-full p-4 sm:p-6 md:p-8 gap-6 sm:gap-8 md:gap-10 md:py-20">

        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-between shrink-0 w-full md:w-[320px]">
          <div className="flex flex-col gap-4">
            <p className="anim-eyebrow m-0 font-sans text-xs font-medium tracking-[0.12em] text-[#1a1a1a] uppercase">
              LAMP STORE &amp; YOU
            </p>
            <h2
              className="anim-heading m-0 font-display font-normal text-[#1a1a1a] leading-tight"
              style={{fontSize: 'clamp(36px, 4vw, 52px)'}}
            >
              The Community
            </h2>
          </div>

          <div className="flex flex-col gap-6 mt-10 md:mt-0">
            <p className="anim-body m-0 font-sans text-[13px] text-[#1a1a1a] leading-relaxed max-w-[260px]">
              Powered by real craftsmanship, made for real spaces. Discover how
              our community are incorporating our lamps into their daily lives.
            </p>

            <div className="anim-controls flex items-center gap-3">
              <button
                type="button"
                onClick={() => slideTo(currentIndexRef.current - 1)}
                aria-label="Previous"
                className="flex items-center justify-center w-10 h-10 border border-[#1a1a1a] bg-transparent cursor-pointer transition-colors duration-300 hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => slideTo(currentIndexRef.current + 1)}
                aria-label="Next"
                className="flex items-center justify-center w-10 h-10 border border-[#1a1a1a] bg-transparent cursor-pointer transition-colors duration-300 hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span
                ref={counterRef}
                className="font-sans text-[12px] text-[#1a1a1a] tracking-wide ml-1"
                aria-live="polite"
              >
                {currentIndex + 1} / {total}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — track wrapper gets explicit height set by syncDimensions */}
        <div
          ref={wrapperRef}
          className="community-track-wrapper flex-1 overflow-hidden relative"
          style={{height: '700px'}} /* overridden by syncDimensions on mount */
        >
          <div
            ref={trackRef}
            className="community-track flex will-change-transform h-full"
            style={{gap: `${GAP}px`, cursor: 'grab', userSelect: 'none', WebkitUserSelect: 'none'}}
          >
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="community-card shrink-0 relative rounded-md overflow-hidden"
                /* width/height set imperatively by syncDimensions */
                style={{width: '500px', minWidth: '500px', height: '700px'}}
              >
                <CardInner card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
