import React from 'react';
import BannerSlider from '../../components/Client/BannerSlider';
import FeaturedCategories from '../../components/Client/FeaturedCategories';
import HotDeals from '../../components/Client/HotDeals';
import DressCollection from '../../components/Client/DressCollection';
import ShirtCollection from '../../components/Client/ShirtCollection';
import AboutIntro from '../../components/Client/AboutIntro';
import NewProducts from '../../components/Client/NewProducts';
import BestSellers from '../../components/Client/BestSellers';

const Home: React.FC = () => {
    return (
        <div>
            <BannerSlider />
            <FeaturedCategories/>
            <HotDeals/>
            <DressCollection/>
            <ShirtCollection/>
            <AboutIntro/>
            <NewProducts/>
            <BestSellers/>
        </div>
    );
};

export default Home;
