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
import FadeInSection from '../../components/Common/FadeInSection';

const Home: React.FC = () => {
    return (
        <div>
            <FadeInSection>
                <BannerSlider />
            </FadeInSection>

            <FadeInSection delay={0.2}>
                <FeaturedCategories />
            </FadeInSection>

            <FadeInSection delay={0.1}>
                <VoucherList />
            </FadeInSection>

            <FadeInSection direction="left">
                <HotDeals />
            </FadeInSection>

            <FadeInSection direction="right">
                <DressCollection />
            </FadeInSection>

            <FadeInSection direction="left">
                <ShirtCollection />
            </FadeInSection>

            <FadeInSection>
                <CategoryBanner />
            </FadeInSection>

            <FadeInSection delay={0.2}>
                <AboutIntro />
            </FadeInSection>

            <FadeInSection direction="up">
                <NewProducts />
            </FadeInSection>

            <FadeInSection direction="up" delay={0.1}>
                <BestSellers />
            </FadeInSection>

            <FadeInSection>
                <PolicySection />
            </FadeInSection>
        </div>
    );
};

export default Home;
