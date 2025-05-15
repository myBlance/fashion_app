import React from 'react';
import BannerSlider from '../../components/Client/BannerSlider';
import FeaturedCategories from '../../components/Client/FeaturedCategories';
import HotDeals from '../../components/Client/HotDeals';

const Home: React.FC = () => {
    return (
        <div>
            <BannerSlider />
            <FeaturedCategories/>
            <HotDeals/>
        </div>
    );
};

export default Home;
