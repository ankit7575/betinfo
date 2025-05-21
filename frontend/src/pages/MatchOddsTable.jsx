import React, { useEffect, useState } from 'react';
import './MatchOddsTable.css';

const MatchOddsTable = () => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const marketData = {
        marketId: "1.243432681",
        updateTime: "2025-05-08T13:07:22.691421+02:00",
        status: "OPEN",
        inplay: true,
        totalMatched: 805682.95,
        runners: [
          {
            selectionId: 152533,
            lastPriceTraded: 1.75,
            ex: {
              availableToBack: [
                { price: 1.72, size: 2.46 },
                { price: 1.71, size: 2 },
                { price: 1.7, size: 2 }
              ],
              availableToLay: [
                { price: 1.75, size: 434.49 },
                { price: 1.77, size: 20.05 },
                { price: 1.78, size: 93.73 }
              ]
            }
          },
          {
            selectionId: 247650,
            lastPriceTraded: 2.32,
            ex: {
              availableToBack: [
                { price: 2.32, size: 327.74 },
                { price: 2.28, size: 88.74 },
                { price: 2.26, size: 6.14 }
              ],
              availableToLay: [
                { price: 2.4, size: 1.77 },
                { price: 2.42, size: 1.41 },
                { price: 2.44, size: 1.39 }
              ]
            }
          }
        ]
      };

      const teamNames = {
        152533: 'Scotland',
        247650: 'United Arab Emirates'
      };

      setMatchData({ market: marketData, teams: teamNames });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p className="loading">Loading market data...</p>;

  return (
    <div className="odds-container">
      <div className="market-header">
        <h2>Match Odds</h2>
        <span>{matchData.market.runners.length} selections</span>
      </div>
      <table className="market-table">
        <thead>
          <tr>
            <th>Team</th>
            <th colSpan="6">Back</th>
            <th colSpan="6">Lay</th>
          </tr>
          <tr>
            <th></th>
            <th>Price</th>
            <th>Stake</th>
            <th>Price</th>
            <th>Stake</th>
             <th>Price</th>
            <th>Stake</th>
             <th>Price</th>
            <th>Stake</th>
             <th>Price</th>
            <th>Stake</th>
             <th>Price</th>
            <th>Stake</th>
          </tr>
        </thead>
        <tbody>
          {matchData.market.runners.map((runner) => (
            <tr key={runner.selectionId}>
              <td>{matchData.teams[runner.selectionId]}</td>

              {/* Back Price + Stake */}
              {runner.ex.availableToBack.map((item, idx) => (
                <>
                  <td key={`back-price-${idx}`} className="price">{item.price}</td>
                  <td key={`back-stake-${idx}`} className="stake">{item.size}</td>
                </>
              ))}

              {/* Lay Price + Stake */}
              {runner.ex.availableToLay.map((item, idx) => (
                <>
                  <td key={`lay-price-${idx}`} className="price">{item.price}</td>
                  <td key={`lay-stake-${idx}`} className="stake">{item.size}</td>
                </>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchOddsTable;
