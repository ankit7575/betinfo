import React, { useEffect } from "react";

/**
 * Props:
 *  - eventId: string or number (required)
 *  - iframeLoaded: boolean
 *  - setIframeLoaded: function
 *  - iframeError: boolean
 *  - setIframeError: function
 *  - sport (optional): 'soccer' | 'tennis'
 */
const SoccerScoreboardCard = ({
  eventId,
  iframeLoaded,
  setIframeLoaded,
  iframeError,
  setIframeError,
  sport = "soccer"
}) => {
  // Updated base URL
  const baseUrl = "https://crickexpo.in/score/sportRadar/?eventId=";

  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
  }, [eventId, setIframeLoaded, setIframeError]);

  if (!eventId) return null;

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

export default SoccerScoreboardCard;
