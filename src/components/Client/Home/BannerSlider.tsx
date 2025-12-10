import { useEffect, useState } from 'react';
import '../../../styles/BannerSlider.css';

const images = [
  '/assets/images/slider_1.webp',
  '/assets/images/slider_2.webp',
  '/assets/images/slider_3.jpg',
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-slider-container">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`slide-${index}`}
          loading="lazy"
          className={`banner-slider-image ${current === index ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};

export default BannerSlider;
