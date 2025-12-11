import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/CategoryBanner.css';

const CategoryBanner: React.FC = () => {
    const navigate = useNavigate();

    const categories = [
        {
            image: '/assets/images/bc7022b6-9a61-47cc-9636-5e7fee3fb561.jpg',
            link: '/shop?type=Đầm',
        },
        {
            image: '/assets/images/5ff8e1ad-bd52-48da-853f-97e1fc241657.webp',
            link: '/shop?type=Quần',
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
