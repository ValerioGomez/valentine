// Sidebar.jsx
import React, { useState } from 'react';
import { Search, CheckCircle2, Volume2, Music, X } from 'lucide-react';

const Sidebar = ({ 
  songs, 
  currentSong, 
  isPlaying, 
  onSelectSong, 
  isCollapsed 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  if (isCollapsed) return null;

  // Filter songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate remaining minutes
  // For standard mock playlist, let's sum duration
  const totalSeconds = songs.reduce((sum, song) => sum + (song.durationSec || 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-title-section">
        <div>
          <h2 className="sidebar-title">Lista de Reproducción</h2>
          <p className="sidebar-subtitle">{totalMinutes} minutos restantes</p>
        </div>
        
        <div className="sidebar-actions">
          <button 
            className="sidebar-icon-btn" 
            onClick={() => setShowSearch(!showSearch)}
            title="Buscar canción"
          >
            {showSearch ? <X size={15} /> : <Search size={15} />}
          </button>
          <button className="sidebar-icon-btn" title="Finalizadas">
            <CheckCircle2 size={15} />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar en la lista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <Search size={14} className="search-icon" />
        </div>
      )}

      <div className="song-list-scroll">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => {
            const isActive = currentSong && currentSong.id === song.id;
            return (
              <div
                key={song.id}
                className={`song-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSong(song)}
              >
                {/* Artwork Gradient */}
                <div 
                  className="song-cover"
                  style={{ background: song.cover || 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}
                >
                  {!song.cover && <Music size={16} className="text-white" />}
                </div>

                <div className="song-info">
                  <div className="song-name">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>

                <div className="song-meta">
                  {isActive && isPlaying && (
                    <Volume2 size={14} className="active-speaker-icon mr-1" />
                  )}
                  <span>{song.duration}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-lyrics" style={{ marginTop: '40px', fontSize: '13px' }}>
            No se encontraron canciones
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
