import React from 'react';
import TipTable from "../components/Home/TipTable";
import AppLayout from "../layout";
import Footer from "../components/Footer";
import JoinPlan from "../components/JoinPlan"
import Banner4 from "../pages/banner4";
import RedeemCoinPage from "../pages/RedeemCoinPage";
import TransactionsPage from "../pages/TransactionsPage"
const Join = () => {
  const sportId = 4; // 👈 Set this properly

  return (
    <>
      <AppLayout />
      <div className='pt-5'>

      <Banner4/>
             <TipTable matchType="Cricket" sportId={sportId} /> {/* 👈 pass it here */}


            
             <div className="container" >
              <RedeemCoinPage/>
             </div>
<div className="container" >
              <TransactionsPage/>
             </div>
 <div className="container" >
              <h1 className='center'>
                Plans
              </h1>
              <JoinPlan/>
             </div>
      </div>
      <Footer />
    </>
  );
};

export default Join;
