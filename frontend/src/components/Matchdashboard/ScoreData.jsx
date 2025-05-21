import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScoreData.css'; // Importing the CSS file for styling

const ScoreData = () => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get('https://api.trovetown.co/v1/apiCalls/scoreData?scoreId=34229708')
      .then((response) => {
        if (response.data && response.data.data) {
          setScoreData(response.data.data[0]); // Assuming the data array has a single object
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching score data:', error);
        setLoading(false);
      });
  }, []);

  // Render loading state if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the score data when available
  if (scoreData) {
    return (
      <div className="score-data-container">
        <div className="score-header">
          <h2>Match: {scoreData.team1} vs {scoreData.team2}</h2>
          <p>{scoreData.cb}</p>
        </div>
        <div className="score-details">
          <div className="team-score">
            <div>
              <strong>{scoreData.team1} Score: </strong>
              {scoreData.score} (Wickets: {scoreData.wicket} | Balls: {scoreData.ballsdone})
            </div>
            <div>
              <strong>{scoreData.team2} Score: </strong>
              {scoreData.score2} (Wickets: {scoreData.wicket2} | Balls: {scoreData.ballsdone2})
            </div>
          </div>
          <div className="recent-balls">
            <h3>Recent Balls:</h3>
            <div className="balls-list">
              {scoreData.recentBalls.map((ball, index) => (
                <span key={index} className="ball-item">
                  {ball.join(', ')} {/* join works now because recentBalls is an array */}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ScoreData;
