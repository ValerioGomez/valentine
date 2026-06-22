// SetupScreen.jsx
import React, { useRef } from 'react';
import { Folder, FileAudio, Play } from 'lucide-react';

const SetupScreen = ({ onImportFiles, onLoadDemoSongs }) => {
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onImportFiles(files);
    }
  };

  const handleFolderChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onImportFiles(files);
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();
  const triggerFolderSelect = () => folderInputRef.current.click();

  return (
    <div className="setup-screen">
      {/* Hidden inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="audio/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderChange}
        multiple
        webkitdirectory=""
        directory=""
        style={{ display: 'none' }}
      />

      <div className="setup-logo-container">
        {/* Valentine App Icon */}
        <div className="setup-logo">
          <svg viewBox="0 0 100 100" className="w-16 h-16 text-white" fill="currentColor">
            {/* White Heart */}
            <path d="M50,82 C43.5,76 15,50 15,33 C15,20 25,12 37,12 C43.5,12 47.5,15.5 50,18.5 C52.5,15.5 56.5,12 63,12 C75,12 85,20 85,33 C85,50 56.5,76 50,82 Z" />
            {/* Music Note Cutout (using background color) */}
            <path d="M46,25 L46,45 C44.5,44 42.5,44 41,45 C39.5,46 38.5,47.5 38.5,49.5 C38.5,52 40.5,54 43,54 C45.5,54 47.5,52 47.5,49.5 L47.5,31 L57.5,28 L57.5,38 C56,37 54,37 52.5,38 C51,39 50,40.5 50,42.5 C50,45 52,47 54.5,47 C57,47 59,45 59,42.5 L59,25 L46,25 Z" fill="#8b5cf6" />
            {/* Play Button Cutout */}
            <polygon points="46,58 46,70 56,64" fill="#ec4899" />
          </svg>
        </div>
        {/* Apple style icon reflection */}
        <div className="setup-logo-reflection">
          <svg viewBox="0 0 100 100" className="w-16 h-16 text-white" fill="currentColor">
            <path d="M50,82 C43.5,76 15,50 15,33 C15,20 25,12 37,12 C43.5,12 47.5,15.5 50,18.5 C52.5,15.5 56.5,12 63,12 C75,12 85,20 85,33 C85,50 56.5,76 50,82 Z" />
            <path d="M46,25 L46,45 C44.5,44 42.5,44 41,45 C39.5,46 38.5,47.5 38.5,49.5 C38.5,52 40.5,54 43,54 C45.5,54 47.5,52 47.5,49.5 L47.5,31 L57.5,28 L57.5,38 C56,37 54,37 52.5,38 C51,39 50,40.5 50,42.5 C50,45 52,47 54.5,47 C57,47 59,45 59,42.5 L59,25 L46,25 Z" fill="#8b5cf6" />
            <polygon points="46,58 46,70 56,64" fill="#ec4899" />
          </svg>
        </div>
      </div>

      <h1 className="setup-title">Valentine</h1>
      <p className="setup-subtext">
        Selecciona un archivo o carpeta, o arrastra archivos desde tu gestor de archivos a la ventana de la aplicación para añadir canciones a la lista de reproducción
      </p>

      <div className="setup-actions">
        <button className="setup-btn setup-btn-primary" onClick={triggerFolderSelect}>
          <Folder size={14} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'text-top' }} />
          Añadir Carpeta...
        </button>
        <button className="setup-btn setup-btn-secondary" onClick={triggerFileSelect}>
          <FileAudio size={14} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'text-top' }} />
          Añadir Archivo...
        </button>
        <button className="setup-btn setup-btn-secondary" onClick={onLoadDemoSongs} style={{ marginTop: '12px', border: '1px dashed rgba(59, 130, 246, 0.4)', color: '#3b82f6' }}>
          <Play size={14} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'text-top' }} />
          Probar con demos
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
