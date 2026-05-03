import {useState} from 'react';
import {Drawer, DrawerContent, DrawerClose} from '~/components/ui/drawer';
import {cn} from '~/lib/utils';
import {HeroProduct1, HeroProduct2, HeroProduct3} from '~/assets/images';

const SLIDES = [
  {
    id: 1,
    title: 'Nilston Extended — Sculptural Elegance',
    description:
      'A masterpiece of form and function. The Nilston Extended features an elongated silhouette that creates dramatic shadows and ambient warmth. Handcrafted with precision, its minimalist design complements both modern and traditional interiors. Perfect for creating intimate reading corners or statement dining spaces.',
    image: HeroProduct1,
  },
  {
    id: 2,
    title: 'Vintage Brass Lamp — Timeless Character',
    description:
      'Authentic brass construction with a patina that tells its own story. This vintage piece brings old-world charm with its warm metallic finish and classic proportions. Each lamp bears unique aging marks, making it truly one-of-a-kind. Ideal for adding nostalgic sophistication to study rooms, entryways, or bedside tables.',
    image: HeroProduct2,
  },
  {
    id: 3,
    title: 'Modern Ceramic — Artisan Craftsmanship',
    description:
      'Where contemporary design meets traditional pottery techniques. The Modern Ceramic lamp showcases smooth, organic curves with a matte finish that diffuses light beautifully. Hand-thrown by skilled artisans, each piece features subtle variations that celebrate the human touch. A perfect centerpiece for minimalist spaces seeking warmth and texture.',
    image: HeroProduct3,
  },
];

export default function DetailFeatProductPopOver({open, onOpenChange}) {
  const [currentSlide, setCurrentSlide] = useState(0); // Start at slide 1 (index 0)

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  const currentData = SLIDES[currentSlide];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed h-full data-[vaul-drawer-direction=bottom]:mt-0 inset-0 z-50 flex items-center justify-center min-h-screen bg-transparent border-none [&>div:first-child]:hidden">
        {/* Prevent scroll when drawer is open */}
        <div className="relative w-full h-full min-h-screen flex items-center justify-center p-4">
          {/* Close Button - Top Right */}
          <DrawerClose
            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </DrawerClose>

          {/* Previous Button - Left */}
          <button
            onClick={handlePrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white hover:bg-gray-100 transition-colors flex items-center justify-center shadow-lg"
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Next Button - Right */}
          <button
            onClick={handleNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white hover:bg-gray-100 transition-colors flex items-center justify-center shadow-lg"
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Main Card */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Progress Indicators */}
            <div className="absolute top-6 left-0 right-0 flex items-center justify-center gap-2 z-10">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    index === currentSlide
                      ? 'w-12 bg-gray-800'
                      : 'w-8 bg-gray-300 hover:bg-gray-400',
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Content Container - Scrollable */}
            <div className="max-h-[80vh] overflow-y-auto">
              <div className="p-8 pt-12">
                {/* Title */}
                <h2 className="font-display text-xl font-normal text-gray-900 mb-4 leading-relaxed">
                  {currentData.title}
                </h2>

                {/* Image */}
                <div className="mb-6 rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={currentData.image}
                    alt={currentData.title}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-gray-500 leading-relaxed">
                  {currentData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
