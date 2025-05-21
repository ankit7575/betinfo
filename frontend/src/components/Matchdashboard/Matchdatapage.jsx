import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Matchdatapage = () => {
  const { eventId } = useParams();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/score/${eventId}`);
        setScoreData(data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchScoreData();
    }
  }, [eventId]);

  if (loading) return <div>Loading match data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!scoreData) return <div>No score data found.</div>;

  return (
    <div className="container mt-4">
      <h2>Live Scoreboard</h2>
      <div className="scoreboard mt-3">
        <p>{scoreData.team1}: {scoreData.score1} / {scoreData.wicket1} ({scoreData.ballsDone1} balls)</p>
        <p>{scoreData.team2}: {scoreData.score2} / {scoreData.wicket2} ({scoreData.ballsDone2} balls)</p>
        <p>Recent Balls: {scoreData.recentBalls?.join(' ') || 'N/A'}</p>
      </div>
    </div>
  );
};

export default Matchdatapage;
