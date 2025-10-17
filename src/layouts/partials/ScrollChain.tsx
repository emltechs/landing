import React, { useEffect, useRef, useState } from "react";

type ChainImage = {
  src: string;
  alt: string;
  title: string;
};

type ChainDescription = {
  icon: string;
  iconAlt: string;
  title: string;
  description: string;
};

type ScrollChainProps = {
  images: ChainImage[];
  descriptions: ChainDescription[];
};

export default function ScrollChain({
  images,
  descriptions,
}: ScrollChainProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0..1 continuous
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the section
      const scrollStart = rect.top;
      const scrollEnd = rect.bottom - windowHeight;

      // Section is in view
      if (scrollStart <= 0 && scrollEnd >= 0) {
        // Calculate progress (0 to 1)
        const totalScrollDistance = sectionHeight - windowHeight;
        const progress = Math.abs(scrollStart) / totalScrollDistance;
        const normalized = Math.max(0, Math.min(1, progress));
        setScrollProgress(normalized);

        // Divide progress into segments for each item, ensuring last item is reachable
        const segmentSize = 1 / images.length;
        const rawIndex = progress / segmentSize;
        const newIndex = Math.min(Math.floor(rawIndex), images.length - 1);

        setActiveIndex(newIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop, images.length]);

  if (!isDesktop) {
    // Mobile: Static layout with images and description cards
    return (
      <div className="w-full px-4 py-12 overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {images.map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden ring-2 ring-slate-100 aspect-[16/9] sm:aspect-[4/3]"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold uppercase tracking-wide">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {descriptions.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-start p-6 rounded-2xl ring-2 ring-slate-100 bg-white"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tertiary">
                <img
                  className="h-7 w-7 object-cover"
                  src={item.icon}
                  alt={item.iconAlt}
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-[300vh] w-full">
      <div className="sticky top-0 left-0 w-full min-h-[500px] h-screen flex flex-col items-center justify-center p-20 lg:p-[80px] pt-4 gap-8">
        {/* Images Section */}
        <div className="flex rounded-3xl overflow-hidden justify-stretch w-full h-full gap-1 flex-row ring-2 ring-offset-2 ring-slate-100 ease-out-expo">
          {images.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden transition-all duration-900 ease-out-expo ${
                activeIndex === index ? "flex-[2]" : "flex-[0.5] opacity-60"
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out-expo ${
                  activeIndex === index ? "scale-105" : ""
                }`}
              />
              {/* Content Overlay with Masking (no white background) */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent flex flex-col items-center justify-end p-12 transition-all duration-700 ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className={`overflow-hidden transition-all duration-700 ease-out ${
                    activeIndex === index
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{
                    maxWidth: "600px",
                    width: "100%",
                    maskImage:
                      "linear-gradient(90deg, transparent, black 40px, black calc(100% - 40px), transparent)",
                    WebkitMaskImage:
                      "linear-gradient(90deg, transparent, black 40px, black calc(100% - 40px), transparent)",
                  }}
                >
                  {/* Masked Content (transparent) */}
                  <div
                    key={activeIndex}
                    className="flex flex-col items-center text-center px-8"
                  >
                    <h3 className="text-white text-3xl lg:text-4xl font-semibold mb-4 uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-lg lg:text-xl leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">
                      {descriptions[index].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
