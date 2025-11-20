import { useEffect, useState } from 'react';

const images = [
  '/assets/images/slider_1.webp',
  '/assets/images/slider_2.webp',
  '/assets/images/slider_3.jpg',
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3s

    return () => clearInterval(interval);
  }, []);

  return (
  <div
    style={{
      width: '100%',
      height: '700px',
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
