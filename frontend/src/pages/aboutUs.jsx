import React from "react";
import AppLayout from "../layout";
import AboutAstafin from "../components/aboutUsBanner";
import Solutionsbox from "../components/Product/Section/Solutionsbox";
import FAQ from "../components/Product/Section/FAQ";
import BookCallBanner from "../components/bookCallBanner";
import Footer from "../components/Footer";

const Aboutus = () => {
  return (
    <>
     <AppLayout />
      {/* About Section */}
      <AboutAstafin />

      {/* Solutions Section */}
      <Solutionsbox />

      {/* FAQ Section */}
      <FAQ />

      {/* Book Call Banner Section */}
      <BookCallBanner />

      {/* Footer */}
      <Footer />
 
    </>
   
  );
};

export default Aboutus;
