import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlans, selectPlan } from '../actions/planAction'; // Import actions
import 'bootstrap/dist/css/bootstrap.min.css';
import './paymentsLab.css'; // Import the paymentsLab.css file
import { useNavigate } from 'react-router-dom';

const Plans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access plans from Redux store
  const planList = useSelector((state) => state.planList);
  const { plans, loading, error } = planList || {};

  // Fetch all plans when the component mounts
  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const handlePay = (plan) => {
    // Dispatch action to select the plan and pass the plan ID
    dispatch(selectPlan({ planId: plan._id }));

    // Navigate to the transaction page with the selected plan data
    navigate('/transaction', { state: { plan } });
  };

  // Loading, error or no plans available handling
  if (loading) return <div>Loading plans...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!plans || plans.length === 0) return <div>No plans available.</div>;

  return (
    <div className="container-fluid planbox">
      <div className="planWrapper">
        {/* Loop through plans to display each plan */}
        {plans.map((plan) => (
          <div key={plan._id} className="loginBox">
                <h3 className="card-title text-center">{plan.price} USDT</h3>
                <p className="plan-name text-center">{plan.name}</p>
                <p><strong>Description:</strong> {plan.description}</p>
                <p><strong>Total Coins:</strong> {plan.totalCoins}</p>
            
            {/* Pay Now button which dispatches selectPlan */}
            <button className="button" onClick={() => handlePay(plan)}>
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
