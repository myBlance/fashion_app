import React from 'react';
import AboutIntro from '../../components/Client/About/AboutIntro';
import BannerSlider from '../../components/Client/Home/BannerSlider';
import BestSellers from '../../components/Client/Home/BestSellers';
import CategoryBanner from '../../components/Client/Home/CategoryBanner';
import DressCollection from '../../components/Client/Home/DressCollection';
import FeaturedCategories from '../../components/Client/Home/FeaturedCategories';
import HotDeals from '../../components/Client/Home/HotDeals';
import NewProducts from '../../components/Client/Home/NewProducts';
import PolicySection from '../../components/Client/Home/PolicySection';
import ShirtCollection from '../../components/Client/Home/ShirtCollection';
import VoucherList from '../../components/Client/Voucher/VoucherList';

const Home: React.FC = () => {
    return (
        <div>
            <BannerSlider />
            <FeaturedCategories />
            <VoucherList />
            <HotDeals />
            <DressCollection />
            <ShirtCollection />
            <CategoryBanner />
            <AboutIntro />
            <NewProducts />
            <BestSellers />
            <PolicySection />
        </div>
    );
};

export default Home;
