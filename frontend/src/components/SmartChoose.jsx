import React from "react";
import { Row, Col } from "antd";

const SmartChoose = () => {
  return (
    <div className="comparison-section">
      <div className="comparison-container">
        <h2 className="comparison-title">Make the right move: Own the success not the debt</h2>
        <div className="table-wrapper">
          {/* Desktop Table Header */}
          <Row gutter={[16, 16]} className="table-header">
            <Col span={6} className="category-column"></Col>
            <Col span={6} className="highlight-column">Asset Leasing</Col>
            <Col span={6} style={{ fontFamily: "'Montserrat Bold'", padding: "24px 24px" }}>Direct Purchase</Col>
            <Col span={6} style={{ fontFamily: "'Montserrat Bold'", padding: "24px 24px" }}>Traditional Financing</Col>
          </Row>
          {tableData.map((row, index) => (
            <Row gutter={[16, 16]} key={index} className="table-row">
              <Col span={6} className="category-column">{row.category}</Col>
              <Col span={6} className="highlight-column">
                <img src="assets/table-check.svg" className="icon-img" />
                {row.assetLeasing.data}
              </Col>
              <Col span={6} style={{paddingLeft: "24px"}} className="normal-column">{row.directPurchase}</Col>
              <Col span={6} style={{paddingLeft: "24px"}} className="normal-column">{row.traditionalFinancing}</Col>
            </Row>
          ))}

          <Row gutter={[16, 16]} key="1123" className="table-row last-row">
            <Col span={6} className="category-column">Balance Sheet Impact</Col>
            <Col span={6} className="highlight-column last-record">
              <img src="assets/table-check.svg" className="icon-img" />
              Off-balance sheet
            </Col>
            <Col span={6} style={{paddingLeft: "24px"}} className="normal-column">Asset on balance sheet</Col>
            <Col span={6} style={{paddingLeft: "24px"}} className="normal-column">Debt on balance sheet</Col>
          </Row>
        </div>

        {/* Mobile Table */}
        <div className="mobile-table">
          {tableData.map((row, index) => (
            <div key={index} className="mobile-row">
              <div className="category">{row.category}</div>
              <div className="mobile-item">
                <span className="label">Asset Leasing</span>
                <div className="value highlight-column">
                  <img src="assets/table-check.svg" className="icon-img" />
                  {row.assetLeasing.data}
                </div>
              </div>
              <div className="mobile-item">
                <span className="label">Direct Purchase</span>
                <div className="value normal-column">{row.directPurchase}</div>
              </div>
              <div className="mobile-item">
                <span className="label">Traditional Financing</span>
                <div className="value normal-column">{row.traditionalFinancing}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const tableData = [
  {
    category: "Initial Capital Required",
    assetLeasing: { data: "Minimal or no down payment" },
    directPurchase: "Full purchase price upfront",
    traditionalFinancing: "Significant down payment required",
  },
  {
    category: "Cash Flow Impact",
    assetLeasing: { data: "Predictable monthly payments" },
    directPurchase: "Large immediate outflow",
    traditionalFinancing: "Fixed monthly payments with interest",
  },
  {
    category: "Tax Treatment",
    assetLeasing: { data: "100% tax-deductible payments" },
    directPurchase: "Depreciation deductions only",
    traditionalFinancing: "Interest and depreciation deductions",
  },
  {
    category: "Asset Management",
    assetLeasing: { data: "Maintenance included" },
    directPurchase: "Owner responsible for all maintenance",
    traditionalFinancing: "Owner responsible for all maintenance",
  },
  {
    category: "Technology Updates",
    assetLeasing: { data: "Easy upgrades at end of term" },
    directPurchase: "Must sell old asset first",
    traditionalFinancing: "Must pay off loan first",
  },
];

export default SmartChoose;