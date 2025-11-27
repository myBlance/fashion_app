import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/CategoryBanner.css';

const CategoryBanner: React.FC = () => {
    const navigate = useNavigate();

    const categories = [
        {
            title: 'Skirts',
            subtitle: 'FALL WINTER 2024',
            image: '/assets/images/skirts-banner.jpg',
            link: '/shop?type=Váy',
        },
        {
            title: 'Shirts',
            subtitle: 'FALL WINTER 2024',
            image: '/assets/images/shirts-banner.jpg',
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
                        <div className="category-banner-overlay" />
                        <div className="category-banner-content">
                            <h2 className="category-banner-title">{category.title}</h2>
                            <p className="category-banner-subtitle">{category.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryBanner;
