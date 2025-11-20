import React from 'react';
import AboutIntro from '../../components/Client/About/AboutIntro';
import BannerSlider from '../../components/Client/Home/BannerSlider';
import BestSellers from '../../components/Client/Home/BestSellers';
import DressCollection from '../../components/Client/Home/DressCollection';
import FeaturedCategories from '../../components/Client/Home/FeaturedCategories';
import HotDeals from '../../components/Client/Home/HotDeals';
import NewProducts from '../../components/Client/Home/NewProducts';
import ShirtCollection from '../../components/Client/Home/ShirtCollection';
import VoucherList from '../../components/Client/Voucher/VoucherList';

const Home: React.FC = () => {
    return (
        <div>
            <BannerSlider />
            <FeaturedCategories/>
            <VoucherList/>
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
