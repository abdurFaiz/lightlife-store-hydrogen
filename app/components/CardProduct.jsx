export default function CardProduct({
  image,
  hoverImage,
  title,
  desc,
  price,
  onAddToCart,
}) {
  return (
    <div className="group flex flex-col bg-white w-full cursor-pointer">
      {/* ── Image area ── */}
      <div className="relative w-full h-[500px] bg-[#e8e8e8] overflow-hidden">
        {image ? (
          <>
            {/* Default image — fades out on hover */}
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
            />
            {/* Hover image — fades in on hover */}
            <img
              src={hoverImage || image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
            />
            <div className="flex flex-row justify-between w-full px-6 absolute top-1/3">
              <span className=" font-display font-bold text-gray-900 text-base capitalize tracking-tight leading-tight">
                {title}
              </span>
              {/* Right: price + note */}
              <span className=" font-display font-bold text-gray-900 text-base capitalize tracking-tight leading-tight">
                IDR {price}
              </span>
            </div>
          </>
        ) : (
          /* placeholder when no image is provided */
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* ── Info row ── */}
      <div className="flex flex-col justify-center items-center gap-0.5 pt-4 max-w-xs mx-auto">
        {desc && (
          <span className="font-sans text-sm text-center text-gray-500 leading-tight">
            {desc}
          </span>
        )}
      </div>
    </div>
  );
}
