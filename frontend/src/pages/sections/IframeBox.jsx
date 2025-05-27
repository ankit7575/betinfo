import React, { useState } from 'react';

const IframeBox = ({
  eventId,
  sportId,           // 👈 Accept sportId as a prop
  iframeLoaded,
  setIframeLoaded,
  iframeError,
  setIframeError
}) => {
  const [showIframe, setShowIframe] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [showController, setShowController] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);

  const handleToggle = () => {
    if (!showIframe) {
      setIframeKey(Date.now());
      setIframeError(false);
      setIframeLoaded(false);
    }
    setShowIframe((prev) => !prev);
  };

  // Build the iframe src using both eventId and sportId
  const iframeSrc = `https://dpmatka.in/dtv.php?id=${eventId}${sportId ? `&sportid=${sportId}` : ''}${showController ? '' : '&controls=0'}`;

  return (
    <div className={`card shadow-sm mb-4 ${fullWidth ? 'w-100' : ''}`}>
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
          <h4 className="mb-0">Live Box</h4>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            {/* Controller Toggle */}
            <div className="form-check form-switch me-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="controllerSwitch"
                checked={showController}
                onChange={() => setShowController((v) => !v)}
                disabled={!showIframe}
              />
              <label
                className="form-check-label"
                htmlFor="controllerSwitch"
                style={{ fontSize: 13 }}
              >
                Show Controller
              </label>
            </div>
            {/* Full Width Toggle */}
            <div className="form-check form-switch me-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="fullWidthSwitch"
                checked={fullWidth}
                onChange={() => setFullWidth((v) => !v)}
              />
              <label
                className="form-check-label"
                htmlFor="fullWidthSwitch"
                style={{ fontSize: 13 }}
              >
                Full Width
              </label>
            </div>
            {/* Turn ON/OFF Button */}
            <button
              className={`btn btn-sm ${showIframe ? 'btn-danger' : 'btn-success'}`}
              onClick={handleToggle}
            >
              {showIframe ? 'Turn OFF' : 'Turn ON'}
            </button>
          </div>
        </div>
        {showIframe ? (
          !iframeError ? (
            <div
              className="embed-responsive embed-responsive-16by9 position-relative"
              style={{
                width: fullWidth ? '100%' : '100%',
                minHeight: 320,
                borderRadius: 9,
                overflow: 'hidden'
              }}
            >
              {!iframeLoaded && (
                <div
                  className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ background: '#161b22', zIndex: 10 }}
                >
                  <span style={{ color: '#00ffc3' }}>Loading Live Box...</span>
                </div>
              )}
              <iframe
                key={iframeKey}
                title="Live Box"
                src={iframeSrc}
                width="100%"
                height="400"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{
                  width: '100%',
                  minHeight: fullWidth ? 440 : 400,
                  border: '2.5px solid #00ffc399',
                  background: '#181b23'
                }}
                onLoad={() => setIframeLoaded(true)}
                onError={() => setIframeError(true)}
              />
            </div>
          ) : (
            <div className="alert alert-warning mt-3">
              ⚠️ Match will be coming soon.
            </div>
          )
        ) : (
          <div className="text-secondary text-center py-4">
            <i>
              Live Box is turned off. Click <b>Turn ON</b> to load or refresh.
            </i>
          </div>
        )}
      </div>
    </div>
  );
};

export default IframeBox;
