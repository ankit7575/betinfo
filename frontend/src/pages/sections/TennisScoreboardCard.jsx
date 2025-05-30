import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Scoreboard.css';

/**
 * Props:
 *  - eventId: string (from search param or parent)
 *  - iframeLoaded: boolean
 *  - setIframeLoaded: fn
 *  - iframeError: boolean
 *  - setIframeError: fn
 *  - sport (optional): string, default "tennis"
 */
const TennisScoreboardCard = ({
  eventId: propEventId,
  iframeLoaded,
  setIframeLoaded,
  iframeError,
  setIframeError,
  sport = 'tennis'
}) => {
  // Accept eventId from props or URL param
  const [searchParams] = useSearchParams();
  const eventId = propEventId || searchParams.get('eventId');

  // Reset loading/error state on eventId change
  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
  }, [eventId, setIframeLoaded, setIframeError]);

  if (!eventId) return null;

  // Use the required iframe URL here:
  const baseUrl = 'https://crickexpo.in/score/sportRadar/?eventId=';

  return (
    <div style={{ width: "100%", minHeight: 320, marginBottom: 12 }}>
      {!iframeLoaded && !iframeError && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <span>Loading Scoreboard...</span>
        </div>
      )}
      {iframeError && (
        <div style={{ textAlign: "center", color: "red", padding: "20px" }}>
          <span>Failed to load scoreboard.</span>
        </div>
      )}
      <iframe
        title={`${sport} scoreboard`}
        src={`${baseUrl}${eventId}`}
        width="100%"
        height="320"
        frameBorder="0"
        style={{
          borderRadius: 8,
          border: "1px solid #eee",
          display: iframeLoaded && !iframeError ? "block" : "none"
        }}
        allowFullScreen
        onLoad={() => setIframeLoaded(true)}
        onError={() => setIframeError(true)}
      />
    </div>
  );
};

export default TennisScoreboardCard;
