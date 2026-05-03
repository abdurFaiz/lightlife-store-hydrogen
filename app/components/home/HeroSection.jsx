import {useRef, useEffect, useState} from 'react';
import {
  HeroImageDark,
  HeroImageDark2,
  HeroImageDark3,
  HeroImageLight,
  HeroImageLight2,
  HeroImageLight3,
  HeroProduct1,
  HeroProduct2,
  HeroProduct3,
} from '~/assets/images';
import VerticalToggle from '~/components/VerticalToggle';
import DetailFeatProductPopOver from '../DetailFeatProductPopOver';
import {gsap} from 'gsap';

// Slideshow configuration
const SLIDES = [
  {
    id: 1,
    darkImage: HeroImageDark,
    lightImage: HeroImageLight,
    product: {
      image: HeroProduct1,
      name: 'Nilston Extended',
      price: 'IDR 233K',
    },
    duration: 40000,
  },
  {
    id: 2,
    darkImage: HeroImageDark2,
    lightImage: HeroImageLight2,
    product: {
      image: HeroProduct2,
      name: 'Vintage Brass Lamp',
      price: 'IDR 189K',
    },
    duration: 40000,
  },
  {
    id: 3,
    darkImage: HeroImageDark3,
    lightImage: HeroImageLight3,
    product: {
      image: HeroProduct3,
      name: 'Modern Ceramic',
      price: 'IDR 299K',
    },
    duration: 40000,
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPopover, setShowPopover] = useState(false);
  const [progress, setProgress] = useState(0);

  const darkImageRefs = useRef([]);
  const lightImageRefs = useRef([]);
  const startTimeRef = useRef(null);
  const isTogglingRef = useRef(false);

  const currentSlideData = SLIDES[currentSlide];

  const handleShowDetailFeatProd = () => {
    setShowPopover(true);
  };

  // Initialize image refs
  useEffect(() => {
    darkImageRefs.current = darkImageRefs.current.slice(0, SLIDES.length);
    lightImageRefs.current = lightImageRefs.current.slice(0, SLIDES.length);
  }, []);

  // Set initial state
  useEffect(() => {
    SLIDES.forEach((_, index) => {
      if (darkImageRefs.current[index]) {
        gsap.set(darkImageRefs.current[index], {
          opacity: index === 0 ? 1 : 0,
        });
      }
      if (lightImageRefs.current[index]) {
        gsap.set(lightImageRefs.current[index], {opacity: 0});
      }
    });
  }, []);

  // Automatic slideshow with progress
  useEffect(() => {
    const duration = currentSlideData.duration;
    startTimeRef.current = Date.now();
    let animationFrameId = null;

    // Animate progress
    const animateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressValue = Math.min((elapsed / duration) * 100, 100);

      setProgress(progressValue);

      if (progressValue >= 100) {
        // Immediately move to next slide without delay
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        // Don't continue the loop - let the new useEffect handle it
      } else {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentSlide, currentSlideData.duration]);

  // Transition between slides (but not during toggle)
  useEffect(() => {
    if (isTogglingRef.current) return; // Skip if currently toggling

    // Reset progress to 0 when slide changes
    setProgress(0);

    // Animate both dark and light images, but only show the current mode
    SLIDES.forEach((_, index) => {
      const isCurrentSlide = index === currentSlide;

      // Animate dark images with faster transition
      if (darkImageRefs.current[index]) {
        gsap.to(darkImageRefs.current[index], {
          opacity: isDarkMode && isCurrentSlide ? 1 : 0,
          duration: 0.8,
          ease: 'power2.inOut',
        });
      }

      // Animate light images with faster transition
      if (lightImageRefs.current[index]) {
        gsap.to(lightImageRefs.current[index], {
          opacity: !isDarkMode && isCurrentSlide ? 1 : 0,
          duration: 0.8,
          ease: 'power2.inOut',
        });
      }
    });
  }, [currentSlide, isDarkMode]);

  // DONT CHANGE ANY RELATED WITH ANIMATION TRANSITION SWITCH TOGGLE
  const handleToggle = (isOn) => {
    isTogglingRef.current = true;

    const timeline = gsap.timeline({
      onComplete: () => {
        // Lock the final opacity values
        SLIDES.forEach((_, index) => {
          const isCurrentSlide = index === currentSlide;
          if (isOn) {
            // Dark mode final state
            gsap.set(darkImageRefs.current[index], {
              opacity: isCurrentSlide ? 1 : 0,
            });
            gsap.set(lightImageRefs.current[index], {opacity: 0});
          } else {
            // Light mode final state
            gsap.set(lightImageRefs.current[index], {
              opacity: isCurrentSlide ? 1 : 0,
            });
            gsap.set(darkImageRefs.current[index], {opacity: 0});
          }
        });

        // Wait before re-enabling slide transitions
        setTimeout(() => {
          setIsDarkMode(isOn);
          isTogglingRef.current = false;
        }, 200);
      },
    });

    if (isOn) {
      // Switch to dark mode with smooth crossfade
      SLIDES.forEach((_, index) => {
        const isCurrentSlide = index === currentSlide;

        // Fade in dark images with smooth easing
        timeline.to(
          darkImageRefs.current[index],
          {
            opacity: isCurrentSlide ? 1 : 0,
            duration: 2.5,
            ease: 'power2.inOut',
          },
          0,
        );

        // Fade out light images with smooth easing
        timeline.to(
          lightImageRefs.current[index],
          {
            opacity: 0,
            duration: 2.5,
            ease: 'power2.inOut',
          },
          0,
        );
      });
    } else {
      // Switch to light mode with smooth crossfade
      SLIDES.forEach((_, index) => {
        const isCurrentSlide = index === currentSlide;

        // Fade in light images with smooth easing
        timeline.to(
          lightImageRefs.current[index],
          {
            opacity: isCurrentSlide ? 1 : 0,
            duration: 2.5,
            ease: 'power2.inOut',
          },
          0,
        );

        // Fade out dark images with smooth easing
        timeline.to(
          darkImageRefs.current[index],
          {
            opacity: 0,
            duration: 2.5,
            ease: 'power2.inOut',
          },
          0,
        );
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-end bg-black">
      {/* Background Images - Dark Mode */}
      {SLIDES.map((slide, index) => (
        <img
          key={`dark-${slide.id}`}
          ref={(el) => (darkImageRefs.current[index] = el)}
          src={slide.darkImage}
          alt={`Hero Dark ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{willChange: 'opacity'}}
        />
      ))}

      {/* Background Images - Light Mode */}
      {SLIDES.map((slide, index) => (
        <img
          key={`light-${slide.id}`}
          ref={(el) => (lightImageRefs.current[index] = el)}
          src={slide.lightImage}
          alt={`Hero Light ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{willChange: 'opacity'}}
        />
      ))}

      {/* Gradient overlay so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

      {/* Main content — sits above overlay */}
      <div className="relative z-20 p-10 flex flex-col md:flex-row md:justify-between items-end w-full">
        <div className="flex flex-col gap-6 max-w-5xl">
          <div className="flex font-sans text-white/70 text-sm flex-row gap-1 items-center flex-wrap">
            <span>Authentic Only ●</span>
            <span>Vintage Vibe ●</span>
            <span>Handmade Curation ●</span>
            <span>Best Value</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1
              className="font-display tracking-tight text-white text-7xl leading-none"
              style={{
                textShadow:
                  '0 0 2px #fff, 0 0 2px #fff, 0 0 1px #e0e0ff, 0 0 4px #c0c0ff, 0 0 120px #a0a0ff',
              }}
            >
              The   Shape of Light
            </h1>
            <p className="text-base text-white/80">
              A dialogue between light, material, and form.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {/* Product Card with Animated Border Progress */}
          <button
            onClick={handleShowDetailFeatProd}
            className="relative flex flex-row gap-2 bg-white/25 backdrop-blur-lg w-fit rounded-xl p-1 items-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* Animated Border Progress */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{borderRadius: '0.75rem'}}
            >
              <rect
                x="2"
                y="2"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="10"
                ry="10"
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (progress / 100) * 1000}
                style={{
                  transition: 'stroke-dashoffset 0.1s linear',
                }}
              />
            </svg>

            <div className="overflow-hidden rounded-lg">
              <img
                src={currentSlideData.product.image}
                alt=""
                className="w-16 object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 p-1 pr-2">
              <h3 className="font-display text-lg text-white font-bold">
                {currentSlideData.product.name}
              </h3>
              <div className="flex flex-row w-full items-center justify-between gap-3">
                <span className="font-sans text-sm text-gray-300 tracking-wider">
                  {currentSlideData.product.price}
                </span>
                <span className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 hover:rotate-180 transition-all ease-in-out duration-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </button>

          <div className="flex flex-row gap-3 items-center">
            <span className="font-display text-white text-2xl tracking-tight">
              Feel the Difference
            </span>
            <VerticalToggle defaultOn={true} onChange={handleToggle} />
          </div>
        </div>
      </div>

      {/* Detail Product Popover */}
      <DetailFeatProductPopOver
        open={showPopover}
        onOpenChange={setShowPopover}
      />
    </section>
  );
}
