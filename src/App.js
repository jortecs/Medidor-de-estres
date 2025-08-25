import React, { useState, useEffect } from 'react';
import './App.css';

const LoadingScreen = () => (
  <div className="loading-container">
    <div>Cargando Detector de Estrés...</div>
  </div>
);

const HomeScreen = () => {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [result, setResult] = useState(null);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem('dailyCount') || '0';
    setDailyCount(parseInt(savedCount));
  }, []);

  const startMeasurement = () => {
    if (dailyCount >= 3) {
      alert('Has alcanzado el límite diario.');
      return;
    }

    setIsMeasuring(true);
    
    setTimeout(() => {
      const stressLevel = Math.floor(Math.random() * 100) + 1;
      const heartRate = Math.floor(Math.random() * 40) + 60;
      const hrv = Math.floor(Math.random() * 50) + 30;
      
      const newResult = {
        stressLevel,
        heartRate,
        hrv,
        timestamp: new Date().toISOString(),
        quality: Math.floor(Math.random() * 30) + 70
      };
      
      setResult(newResult);
      setIsMeasuring(false);
      
      const measurements = JSON.parse(localStorage.getItem('measurements') || '[]');
      measurements.unshift(newResult);
      localStorage.setItem('measurements', JSON.stringify(measurements));
      
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      localStorage.setItem('dailyCount', newCount.toString());
    }, 3000);
  };

  const getStressColor = (level) => {
    if (level <= 30) return '#4CAF50';
    if (level <= 60) return '#FF9800';
    return '#F44336';
  };

  const getStressText = (level) => {
    if (level <= 30) return 'Bajo';
    if (level <= 60) return 'Moderado';
    return 'Alto';
  };

  return (
    <div className="screen">
      <div className="header">
        <h2>Medir Estrés</h2>
        <p>Coloca tu dedo sobre la cámara para medir tu nivel de estrés</p>
      </div>

      <div className="daily-limit">
        <p>Mediciones hoy: {dailyCount}/3</p>
      </div>

      <div className="camera-container">
        <div className="camera-placeholder">
          {isMeasuring ? (
            <>
              <div className="pulse-indicator">💓</div>
              <p>Simulando medición...</p>
            </>
          ) : (
            <>
              <div className="camera-icon">📷</div>
              <p>Simulación de cámara</p>
            </>
          )}
        </div>
      </div>

      <button 
        className={`measure-button ${isMeasuring ? 'disabled' : ''}`}
        onClick={startMeasurement}
        disabled={isMeasuring}
      >
        {isMeasuring ? 'Mediendo...' : 'Iniciar Medición'}
      </button>

      {result && (
        <div className="result-container">
          <div 
            className="result-card"
            style={{ backgroundColor: getStressColor(result.stressLevel) }}
          >
            <h3>Resultado de la Medición</h3>
            <div className="metric">
              <span>Nivel de Estrés:</span>
              <span>{result.stressLevel}% ({getStressText(result.stressLevel)})</span>
            </div>
            <div className="metric">
              <span>Frecuencia Cardíaca:</span>
              <span>{result.heartRate} BPM</span>
            </div>
            <div className="metric">
              <span>Variabilidad Cardíaca:</span>
              <span>{result.hrv} ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryScreen = () => {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('measurements') || '[]');
    setMeasurements(saved);
  }, []);

  const deleteMeasurement = (index) => {
    const newMeasurements = measurements.filter((_, i) => i !== index);
    localStorage.setItem('measurements', JSON.stringify(newMeasurements));
    setMeasurements(newMeasurements);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES');
  };

  return (
    <div className="screen">
      <div className="header">
        <h2>Historial</h2>
        <p>Revisa tus mediciones anteriores</p>
      </div>

      <div className="measurements-list">
        <h3>Mediciones Recientes</h3>
        {measurements.length === 0 ? (
          <p>No hay mediciones registradas</p>
        ) : (
          measurements.map((measurement, index) => (
            <div key={index} className="measurement-card">
              <div className="measurement-header">
                <div className="measurement-date">{formatDate(measurement.timestamp)}</div>
                <button 
                  className="delete-button"
                  onClick={() => deleteMeasurement(index)}
                >
                  🗑️
                </button>
              </div>
              <div className="measurement-metrics">
                <div>Estrés: {measurement.stressLevel}%</div>
                <div>Frecuencia: {measurement.heartRate} BPM</div>
                <div>HRV: {measurement.hrv} ms</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const TipsScreen = () => {
  const tips = [
    {
      icon: '🧘',
      title: 'Respiración Profunda',
      description: 'Practica respiración 4-7-8: inhala 4 segundos, mantén 7, exhala 8.'
    },
    {
      icon: '🚶',
      title: 'Caminata Diaria',
      description: '30 minutos de caminata al día reducen significativamente el estrés.'
    },
    {
      icon: '💧',
      title: 'Hidratación',
      description: 'Mantén una buena hidratación. El agua ayuda a regular el cortisol.'
    }
  ];

  return (
    <div className="screen">
      <div className="header">
        <h2>Consejos Anti-Estrés</h2>
        <p>Técnicas y hábitos para reducir tu nivel de estrés</p>
      </div>

      <div className="tips-container">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <div className="tip-header">
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-info">
                <h3>{tip.title}</h3>
              </div>
            </div>
            <p className="tip-description">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsScreen = () => {
  return (
    <div className="screen">
      <div className="header">
        <h2>Configuración</h2>
        <p>Personaliza tu experiencia</p>
      </div>

      <div className="version-info">
        <p>Versión 1.0.0 - Detector de Estrés</p>
        <p>Desarrollado para web</p>
      </div>
    </div>
  );
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'tips':
        return <TipsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Detector de Estrés</h1>
        <nav className="app-nav">
          <button 
            className={`nav-button ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('home')}
          >
            🏠 Inicio
          </button>
          <button 
            className={`nav-button ${currentScreen === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('history')}
          >
            📊 Historial
          </button>
          <button 
            className={`nav-button ${currentScreen === 'tips' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('tips')}
          >
            💡 Consejos
          </button>
          <button 
            className={`nav-button ${currentScreen === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('settings')}
          >
            ⚙️ Configuración
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;
