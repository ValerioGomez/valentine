// InteractivePlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Sidebar as SidebarIcon, Moon, Sun, Monitor, Trash2, Plus
} from 'lucide-react';
import { mockSongs } from '../mockSongs';
import Sidebar from './Sidebar';
import SetupScreen from './SetupScreen';
import Waveform from './Waveform';
import LyricsView from './LyricsView';

const InteractivePlayer = () => {
  // Playlist state
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Controls state
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState('all'); // 'none' | 'all' | 'one'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light' | 'glass'
  const [isDragging, setIsDragging] = useState(false);

  // Audio reference
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Sync volume state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play/pause toggles
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Handle song changes (auto play new song)
  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
    }
    setIsPlaying(!isPlaying);
  };

  // Skip forward
  const nextSong = () => {
    if (songs.length === 0) return;
    
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else if (currentSong) {
      const currentIndex = songs.findIndex(s => s.id === currentSong.id);
      nextIndex = (currentIndex + 1) % songs.length;
    }

    playSong(songs[nextIndex]);
  };

  // Skip backward
  const prevSong = () => {
    if (songs.length === 0) return;

    // Restart song if played for more than 3 seconds
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    let prevIndex = songs.length - 1;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else if (currentSong) {
      const currentIndex = songs.findIndex(s => s.id === currentSong.id);
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = songs.length - 1;
    }

    playSong(songs[prevIndex]);
  };

  // Volume slider operations
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  // Progress update handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Seek bar clicks
  const handleProgressClick = (e) => {
    if (!audioRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    const newTime = clickPercentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Handle song ending
  const handleEnded = () => {
    if (isRepeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
        setCurrentTime(0);
      }
    } else if (isRepeat === 'all') {
      nextSong();
    } else {
      const currentIndex = songs.findIndex(s => s.id === currentSong.id);
      if (currentIndex < songs.length - 1) {
        nextSong();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  };

  // Cycle repeat modes
  const toggleRepeat = () => {
    if (isRepeat === 'none') setIsRepeat('all');
    else if (isRepeat === 'all') setIsRepeat('one');
    else setIsRepeat('none');
  };

  // Load Demo songs
  const loadDemoSongs = () => {
    setSongs(mockSongs);
    setCurrentSong(mockSongs[0]);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Clear current playlist
  const clearPlaylist = () => {
    setIsPlaying(false);
    setSongs([]);
    setCurrentSong(null);
    setCurrentTime(0);
    setDuration(0);
  };

  // File import helpers
  const handleImportFiles = (fileList) => {
    const imported = [];
    const colors = [
      ["#ef4444", "#3b82f6", "#10b981"],
      ["#f59e0b", "#ec4899", "#8b5cf6"],
      ["#3b82f6", "#1d4ed8", "#1e3a8a"],
      ["#10b981", "#059669", "#064e3b"],
      ["#8b5cf6", "#6d28d9", "#4c1d95"],
      ["#ec4899", "#be185d", "#4c0519"]
    ];

    Array.from(fileList).forEach((file, index) => {
      if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.flac') || file.name.endsWith('.m4a')) {
        const audioUrl = URL.createObjectURL(file);
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const parts = nameWithoutExt.split('-');
        
        let title = nameWithoutExt;
        let artist = "Artista Desconocido";
        if (parts.length > 1) {
          artist = parts[0].trim();
          title = parts.slice(1).join('-').trim();
        }

        const colorSet = colors[index % colors.length];
        
        imported.push({
          id: `local-${Date.now()}-${index}`,
          title,
          artist,
          album: "Importado localmente",
          duration: "0:00",
          durationSec: 0,
          cover: `linear-gradient(135deg, ${colorSet[0]} 0%, ${colorSet[1]} 50%, ${colorSet[2]} 100%)`,
          gradientColors: colorSet,
          audioUrl,
          lyrics: [
            { time: 0, text: "♫ (Reproduciendo archivo local) ♫" },
            { time: 5, text: `Archivo: ${file.name}` },
            { time: 10, text: "Usa archivos con letra .lrc para sincronización completa." },
            { time: 20, text: "Valentine visualizer está activo." }
          ]
        });
      }
    });

    if (imported.length > 0) {
      const newSongs = [...songs, ...imported];
      setSongs(newSongs);
      if (!currentSong) {
        setCurrentSong(imported[0]);
      }
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleImportFiles(e.dataTransfer.files);
    }
  };

  // Format second to time MM:SS
  const formatTime = (timeInSecs) => {
    if (isNaN(timeInSecs)) return "0:00";
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatRemainingTime = (curr, dur) => {
    const remaining = dur - curr;
    if (isNaN(remaining) || remaining < 0) return "-0:00";
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    return `-${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Extract current song background gradient style
  const activeGradientColors = currentSong?.gradientColors || ["#1e293b", "#0f172a", "#312e81"];
  const dynamicGlowStyle = {
    background: `radial-gradient(circle, ${activeGradientColors[2] || '#3b82f6'} 0%, ${activeGradientColors[1] || '#111827'} 70%, transparent 100%)`,
    transform: isPlaying ? 'scale(1.15)' : 'scale(1)',
    transition: 'all 2s ease'
  };

  return (
    <div 
      className={`app-container ${theme}-theme`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden' }}
    >
      {/* Hidden audio tag */}
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
      />

      {/* Background wallpaper for glassmorphism */}
      {theme === 'glass' && <div className="desktop-wallpaper" style={{ borderRadius: '24px' }} />}

      {/* Dynamic ambient background glow */}
      {currentSong && (
        <div className="ambient-background animate-pulse" style={dynamicGlowStyle} />
      )}

      {/* Drag & drop overlay indicator */}
      {isDragging && (
        <div className="drag-overlay" style={{ borderRadius: '24px' }}>
          <div className="drag-icon-container">
            <Plus size={40} className="animate-bounce" />
          </div>
          <h2>Arrastra tus archivos de música aquí</h2>
          <p>Suelta para añadirlos a la lista de reproducción</p>
        </div>
      )}

      {/* Valentine Window Frame */}
      <div className="valentine-window" style={{ width: '100%', height: '100%', borderRadius: '24px' }}>
        {/* macOS Style Window controls */}
        <div className="macos-dots">
          <div className="dot dot-red" onClick={clearPlaylist} title="Limpiar todo / Regresar"></div>
          <div className="dot dot-yellow" title="Minimizar"></div>
          <div className="dot dot-green" title="Maximizar"></div>
          
          <button 
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title="Mostrar/ocultar barra lateral"
          >
            <SidebarIcon size={14} />
          </button>
        </div>

        {/* Sidebar Component */}
        <Sidebar
          songs={songs}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onSelectSong={playSong}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Pane */}
        <div className="player-pane">
          {/* Header Bar */}
          <div className="player-header">
            {songs.length > 0 && (
              <button 
                className="sub-control-btn mr-4" 
                onClick={clearPlaylist}
                title="Cerrar reproducción y regresar"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={14} />
              </button>
            )}

            <div className="theme-selector">
              <button 
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={11} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                Oscuro
              </button>
              <button 
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <Sun size={11} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                Claro
              </button>
              <button 
                className={`theme-btn ${theme === 'glass' ? 'active' : ''}`}
                onClick={() => setTheme('glass')}
              >
                <Monitor size={11} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                Cristal
              </button>
            </div>
          </div>

          <div className="player-body">
            {songs.length === 0 ? (
              // Empty Setup screen
              <SetupScreen 
                onImportFiles={handleImportFiles}
                onLoadDemoSongs={loadDemoSongs}
              />
            ) : (
              // Active music player panel
              <div className="active-player-layout">
                {/* Left Side: Dynamic Lyrics Scrolling */}
                <LyricsView 
                  lyrics={currentSong?.lyrics}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                />

                {/* Right Side: Media Control Deck */}
                <div className="controls-container">
                  {/* Song Info Details */}
                  <div className="current-song-details">
                    <h2 className="current-title">{currentSong?.title}</h2>
                    <p className="current-artist-album">
                      {currentSong?.artist} — {currentSong?.album}
                    </p>
                  </div>

                  {/* Waveform graphic visualizer */}
                  <Waveform 
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    theme={theme}
                  />

                  {/* Progress Seek Slider */}
                  <div className="timeline-section">
                    <div 
                      className="progress-bar-container"
                      ref={progressBarRef}
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      >
                        <div className="slider-thumb" />
                      </div>
                    </div>
                    <div className="time-stamps">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatRemainingTime(currentTime, duration)}</span>
                    </div>
                  </div>

                  {/* Primary control buttons */}
                  <div className="buttons-deck">
                    <button 
                      className={`control-btn ${isShuffle ? 'active' : ''}`} 
                      onClick={() => setIsShuffle(!isShuffle)}
                      title="Aleatorio"
                    >
                      <Shuffle size={18} />
                    </button>

                    <button className="control-btn" onClick={prevSong} title="Anterior">
                      <SkipBack size={22} fill="currentColor" />
                    </button>

                    <button className="control-btn play-pause-btn" onClick={togglePlay} title={isPlaying ? 'Pausar' : 'Reproducir'}>
                      {isPlaying ? (
                        <Pause size={28} fill="currentColor" />
                      ) : (
                        <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />
                      )}
                    </button>

                    <button className="control-btn" onClick={nextSong} title="Siguiente">
                      <SkipForward size={22} fill="currentColor" />
                    </button>

                    <button 
                      className={`control-btn ${isRepeat !== 'none' ? 'active' : ''}`} 
                      onClick={toggleRepeat}
                      title="Repetir"
                    >
                      {isRepeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                    </button>
                  </div>

                  {/* Volume Slider Section */}
                  <div className="volume-section">
                    <button onClick={toggleMute} title="Silenciar / Activar sonido" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit' }}>
                      {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input 
                      type="range"
                      className="volume-slider"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractivePlayer;
