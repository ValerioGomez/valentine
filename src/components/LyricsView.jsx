// LyricsView.jsx
import React, { useEffect, useRef } from 'react';

const LyricsView = ({ lyrics, currentTime, onSeek }) => {
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  // Find active line index
  let activeIndex = -1;
  if (lyrics && lyrics.length > 0) {
    // Find the last lyric line whose time is <= currentTime
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }
  }

  // Smooth scroll active line to center
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="no-lyrics">
        <span>No hay letra sincronizada disponible para este tema.</span>
      </div>
    );
  }

  return (
    <div className="lyrics-container">
      <div className="lyrics-scroller" ref={containerRef}>
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`lyric-line ${isActive ? 'active' : ''}`}
              onClick={() => onSeek(line.time)}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LyricsView;
