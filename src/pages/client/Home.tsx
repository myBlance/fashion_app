import React from 'react';
import BannerSlider from '../../components/Client/BannerSlider';
import FeaturedCategories from '../../components/Client/FeaturedCategories';

const Home: React.FC = () => {
    return (
        <div>
            <BannerSlider />
            <FeaturedCategories/>
        </div>
    );
};

export default Home;
