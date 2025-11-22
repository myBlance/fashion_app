import { useEffect, useState } from 'react';

const images = [
  '/assets/images/slider_1.webp',
  '/assets/images/slider_2.webp',
  '/assets/images/slider_3.jpg',
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);
  const [height, setHeight] = useState("700px"); // default desktop

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Responsive height
  useEffect(() => {
    const updateHeight = () => {
      const w = window.innerWidth;

      if (w <= 600) setHeight("260px");          // mobile
      else if (w <= 1024) setHeight("450px");    // tablet
      else setHeight("700px");                   // desktop
    };

    updateHeight(); // call now
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: height,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`slide-${index}`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: current === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
};

export default BannerSlider;
