import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/CategoryBanner.css';

const CategoryBanner: React.FC = () => {
    const navigate = useNavigate();

    const categories = [
        {
            image: '/assets/images/banner_three_1.webp',
            link: '/shop?type=Đầm',
        },
        {
            image: '/assets/images/tshirtbaner_2.webp',
            link: '/shop?type=Áo',
        },
    ];

    return (
        <section className="category-banner-section">
            <div className="category-banner-container">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="category-banner-card"
                        onClick={() => navigate(category.link)}
                        style={{ backgroundImage: `url(${category.image})` }}
                    >
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryBanner;
