import React from "react";
import SimpleStepsSection from "../components/SimpleStepsSection";
import TipTable from "../components/Home/TipTable";
import AppLayout from "../layout";
import Footer from "../components/Footer";
import BenefitsSection from "../components/Home/BenefitSection";
import BannerSlider from "../components/Home/BannerSlider";
import Solutionsbox from "../components/Product/Section/Solutionsbox";
import FAQ from "../components/Product/Section/FAQ";

import Banner2 from "../pages/banner2";
import Banner3 from "../pages/banner3";
import Banner4 from "../pages/banner4";
import CoinCountdown from '../pages/CoinCountdown';
const Home = () => {
  const sportId = 4; // 👈 Set this properly

  return (
    <>
      <AppLayout />
      <BannerSlider />
        <TipTable matchType="Cricket" sportId={sportId} /> {/* 👈 pass it here */}
<Banner2/>

      {/* Solutions Section */}
      <Solutionsbox />
      <Banner3/>
      <BenefitsSection />
      <Banner4/>
      {/* FAQ Section */}
      <FAQ />
   
      <SimpleStepsSection />
      <CoinCountdown />
      <Footer />
    </>
  );
};

export default Home;
