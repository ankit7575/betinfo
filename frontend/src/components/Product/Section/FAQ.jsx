import React, { useState } from "react";
import "./Section.css";

// Define the FAQ structure
const faqData = {
  "Betting Insights": [
    {
      question: "How do AI predictions improve my betting strategy?",
      answer:
        "Our AI-driven predictions use historical data, player statistics, and other factors to generate accurate odds and outcomes, helping you make informed betting decisions.",
    },
    {
      question: "Which sports do you provide betting insights for?",
      answer:
        "We provide expert tips and predictions for Cricket, Football, and Tennis. Stay updated with real-time insights for the latest matches.",
    },
    {
      question: "How often are your betting tips updated?",
      answer:
        "Our betting tips are updated in real-time, giving you access to the most current insights as the match progresses. This ensures you can make informed decisions throughout the event.",
    },
    {
      question: "Can I trust the betting tips provided by BetInfo.Live?",
      answer:
        "Yes, our tips are generated using a combination of AI algorithms and expert analysis to provide the most accurate and reliable betting insights available.",
    },
    {
      question: "Do I need a subscription to access betting insights?",
      answer:
        "Yes, we offer various subscription plans that provide access to our premium betting insights. You can choose a plan based on your betting needs and preferences.",
    },
  ],
  "Subscription Plans": [
    {
      question: "What subscription plans do you offer?",
      answer:
        "We offer three main subscription plans: 1-event, 20-events, and 30-events, giving you access to the betting tips for your chosen number of events.",
    },
    {
      question: "How do I subscribe to your betting tips?",
      answer:
        "You can subscribe directly through our website by choosing the plan that suits you best. Once subscribed, you'll get access to the latest betting insights via email or through your account.",
    },
    {
      question: "Can I change my subscription plan later?",
      answer:
        "Yes, you can upgrade or downgrade your subscription plan at any time. We offer flexible options to suit your needs.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "To cancel your subscription, simply go to your account settings and follow the instructions for cancellation. You can cancel anytime before the next billing cycle.",
    },
    {
      question: "Do you offer any trial periods?",
      answer:
        "Currently, we do not offer a free trial, but we provide a money-back guarantee if you're not satisfied with your subscription within the first 7 days.",
    },
  ],
};

const FAQ = () => {
  // State to track active category and open questions
  const [activeCategory, setActiveCategory] = useState("Betting Insights");
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container">
      <div className="FAQ" id="sectionpadding">
        <h1>Frequently Asked Questions</h1>

        {/* Button Group */}
        <div className="faq-buttons">
          {Object.keys(faqData).map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Content with Dropdown */}
        <div className="faq-content">
          {faqData[activeCategory].map((item, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
              <div className="faq-question" onClick={() => toggleDropdown(index)}>
                <h2>{item.question}</h2>
                <span className={`faq-toggle ${openIndex === index ? "open" : ""}`}>&#9660;</span>
              </div>
              {openIndex === index && <p className="faq-answer">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
