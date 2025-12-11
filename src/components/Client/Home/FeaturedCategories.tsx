import { useNavigate } from 'react-router-dom';
import '../../../styles/FeaturedCategories.css';

const categories = [
  { name: 'Áo', image: '/assets/icons/icon1.webp' },
  { name: 'Quần', image: '/assets/icons/icon2.webp' },
  { name: 'Váy', image: '/assets/icons/icon3.webp' },
  { name: 'Đầm', image: '/assets/icons/icon4.webp' },
  { name: 'Quần jeans', image: '/assets/icons/icon5.webp' },
  { name: 'Áo len', image: '/assets/icons/icon6.webp' },
  { name: 'Áo nỉ', image: '/assets/icons/icon7.webp' },
];

const FeaturedCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?type=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="featured-categories-container">
      <h3 className="featured-categories-title">
        Danh mục nổi bật
      </h3>

      <div className="featured-categories-list">
        {categories.map((type, index) => (
          <div
            key={index}
            className="category-item"
            onClick={() => handleCategoryClick(type.name)}
          >
            <div className="category-img-wrapper">
              <img
                src={type.image}
                alt={type.name}
                className="category-img"
              />
            </div>
            <p className="category-name">
              {type.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;
