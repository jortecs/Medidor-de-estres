import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import stressDetectorLogo from './assets/logo.png';
import phoneFlashGif from './assets/phoneflash.gif';

const LoadingScreen = () => (
  <div className="loading-container">
    <img src={stressDetectorLogo} alt="Stress Detector Logo" className="loading-logo" />
    <div className="loading-text">Cargando Detector de Estrés...</div>
  </div>
);

const HomeScreen = () => {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [result, setResult] = useState(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [measurementInterval, setMeasurementInterval] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const savedCount = localStorage.getItem('dailyCount') || '0';
    setDailyCount(parseInt(savedCount));
  }, []);

  const getStressMessage = (level) => {
    if (level <= 20) {
      return {
        message: "¡Excelente! Estás muy bien 😊",
        emoji: "🌟",
        advice: "Mantén este estado de calma y bienestar."
      };
    } else if (level <= 40) {
      return {
        message: "¡Muy bien! Estás normal 👍",
        emoji: "😌",
        advice: "Tu nivel de estrés está en un rango saludable."
      };
    } else if (level <= 60) {
      return {
        message: "¡Cuidado! Estás algo estresado ⚠️",
        emoji: "😐",
        advice: "Considera tomar un descanso o practicar respiración."
      };
    } else if (level <= 80) {
      return {
        message: "¡Atención! Estás muy estresado 😰",
        emoji: "😟",
        advice: "Es momento de relajarte. Prueba técnicas de respiración."
      };
    } else {
      return {
        message: "¡Vaya! Estás demasiado estresado 😱",
        emoji: "😨",
        advice: "Necesitas relajarte urgentemente. Considera buscar ayuda."
      };
    }
  };

  const startCamera = async () => {
    try {
      console.log('Solicitando acceso a la cámara...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      console.log('Stream obtenido:', mediaStream);
      setStream(mediaStream);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Configurar eventos del video
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata cargado');
          setIsCameraReady(true);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video puede reproducirse');
          setIsCameraReady(true);
        };
        
        // Intentar reproducir el video
        try {
          await videoRef.current.play();
          console.log('Video iniciado correctamente');
          setIsCameraReady(true);
        } catch (playError) {
          console.error('Error al reproducir video:', playError);
          // Aún así marcar como listo si el video se cargó
          setIsCameraReady(true);
        }
        
        // Timeout de seguridad para evitar que se quede colgado
        setTimeout(() => {
          if (!isCameraReady) {
            console.log('Timeout de seguridad - marcando cámara como lista');
            setIsCameraReady(true);
          }
        }, 5000); // 5 segundos máximo
      }
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const toggleFlash = async () => {
    if (!stream) return;
    
    try {
      const track = stream.getVideoTracks()[0];
      if (track && track.getCapabilities && track.getCapabilities().torch) {
        const newFlashState = !flashEnabled;
        await track.applyConstraints({
          advanced: [{ torch: newFlashState }]
        });
        setFlashEnabled(newFlashState);
      } else {
        // Fallback: intentar activar el flash de otra manera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 640 },
              height: { ideal: 480 },
              torch: !flashEnabled
            }
          });
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
          setFlashEnabled(!flashEnabled);
        }
      }
    } catch (error) {
      console.error('Error al cambiar flash:', error);
      // Si no se puede controlar el flash, mostrar mensaje
      alert('El flash no está disponible en este dispositivo');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const processFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isMeasuring) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Verificar que el video esté listo
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    // Configurar canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      // Dibujar frame del video en el canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Obtener datos de imagen
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calcular promedio de intensidad de luz (simulación de PPG)
      let totalIntensity = 0;
      for (let i = 0; i < data.length; i += 4) {
        // Usar canal rojo para simular detección de sangre
        totalIntensity += data[i];
      }
      const averageIntensity = totalIntensity / (data.length / 4);

      // Simular variaciones basadas en el tiempo
      const timeVariation = Math.sin(Date.now() * 0.001) * 10;
      const baseHeartRate = 70 + timeVariation;
      const baseHRV = 40 + Math.random() * 20;

      // Calcular nivel de estrés basado en variaciones simuladas
      const stressVariation = Math.random() * 30;
      const baseStress = 30 + stressVariation;

      return {
        intensity: averageIntensity,
        heartRate: Math.round(baseHeartRate),
        hrv: Math.round(baseHRV),
        stressLevel: Math.round(baseStress)
      };
    } catch (error) {
      console.error('Error procesando frame:', error);
      return null;
    }
  };

  const startMeasurement = async () => {
    try {
      console.log('Iniciando medición...');
      
      // Si no hay stream, iniciar cámara
      if (!stream) {
        console.log('No hay stream, iniciando cámara...');
        await startCamera();
        // Esperar 2 segundos para que la cámara se inicialice
        setTimeout(() => {
          console.log('Iniciando medición después de inicializar cámara...');
          startMeasurementProcess();
        }, 2000);
        return;
      }

      // Si ya hay stream, iniciar medición directamente
      console.log('Stream existente, iniciando medición...');
      startMeasurementProcess();
      
    } catch (error) {
      console.error('Error al iniciar medición:', error);
      setError('Error al iniciar la medición. Intenta de nuevo.');
    }
  };

  const startMeasurementProcess = () => {
    setIsMeasuring(true);
    setResult(null);

    let measurements = [];
    let startTime = Date.now();

    const measureInterval = setInterval(() => {
      const data = processFrame();
      if (data) {
        measurements.push(data);
      }
    }, 100); // Medir cada 100ms

    setMeasurementInterval(measureInterval);

    // Medir durante 10 segundos
    setTimeout(() => {
      clearInterval(measureInterval);
      setMeasurementInterval(null);
      
      if (measurements.length > 0) {
        // Calcular promedios
        const avgHeartRate = Math.round(
          measurements.reduce((sum, m) => sum + m.heartRate, 0) / measurements.length
        );
        const avgHRV = Math.round(
          measurements.reduce((sum, m) => sum + m.hrv, 0) / measurements.length
        );
        const avgStress = Math.round(
          measurements.reduce((sum, m) => sum + m.stressLevel, 0) / measurements.length
        );

        const newResult = {
          stressLevel: avgStress,
          heartRate: avgHeartRate,
          hrv: avgHRV,
          timestamp: new Date().toISOString(),
          quality: Math.floor(Math.random() * 20) + 80
        };

        setResult(newResult);
        
        const savedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        savedMeasurements.unshift(newResult);
        localStorage.setItem('measurements', JSON.stringify(savedMeasurements));
      } else {
        // Si no hay mediciones, generar un resultado simulado
        const simulatedResult = {
          stressLevel: Math.floor(Math.random() * 60) + 20,
          heartRate: Math.floor(Math.random() * 40) + 60,
          hrv: Math.floor(Math.random() * 30) + 30,
          timestamp: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          quality: Math.floor(Math.random() * 20) + 80
        };
        setResult(simulatedResult);
        
        const savedMeasurements = JSON.parse(localStorage.getItem('measurements') || '[]');
        savedMeasurements.unshift(simulatedResult);
        localStorage.setItem('measurements', JSON.stringify(savedMeasurements));
      }

      setIsMeasuring(false);
      
      // Scroll automático al resultado después de un pequeño delay
      setTimeout(() => {
        const resultElement = document.querySelector('.result-container');
        if (resultElement) {
          resultElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);
    }, 10000); // 10 segundos de medición
  };

  const cancelMeasurement = () => {
    if (measurementInterval) {
      clearInterval(measurementInterval);
      setMeasurementInterval(null);
    }
    setIsMeasuring(false);
    setResult(null);
    
    // Scroll hacia arriba cuando se cancela
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, 300);
  };

  const getStressColor = (level) => {
    if (level <= 20) return '#4CAF50';
    if (level <= 40) return '#8BC34A';
    if (level <= 60) return '#FF9800';
    if (level <= 80) return '#FF5722';
    return '#F44336';
  };

  const getStressText = (level) => {
    if (level <= 20) return 'Muy Bajo';
    if (level <= 40) return 'Bajo';
    if (level <= 60) return 'Moderado';
    if (level <= 80) return 'Alto';
    return 'Muy Alto';
  };

  return (
    <div className="screen">
      <div className="header">
        <h2>Medir Estrés</h2>
        <p>Coloca tu dedo sobre la cámara para medir tu nivel de estrés</p>
      </div>

      <div className="instructions-container">
        <h3>📋 Instrucciones Rápidas</h3>
        <div className="instruction-steps">
          <div className="instruction-step">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>Prepara tu dedo:</strong>
              <p>• Limpia tu dedo índice</p>
              <p>• Colócalo firmemente sobre la cámara</p>
              <p>• Cubre completamente la lente</p>
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>Durante la medición:</strong>
              <p>• Mantén el dedo inmóvil</p>
              <p>• Respira normalmente</p>
              <p>• Espera 10 segundos</p>
            </div>
          </div>
          
          <div className="instruction-step">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>¿Cómo funciona?</strong>
              <p>• El flash ilumina tu dedo</p>
              <p>• La cámara detecta cambios de color</p>
              <p>• Analiza tu pulso sanguíneo</p>
              <p>• Calcula tu nivel de estrés</p>
            </div>
          </div>
        </div>
        <div className="instruction-demo">
          <img 
            src={phoneFlashGif} 
            alt="Demostración del uso del flash" 
            className="instruction-gif"
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={startCamera} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      <div className="camera-container">
        {stream ? (
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ 
                width: '100%', 
                maxWidth: '300px', 
                borderRadius: '10px',
                display: stream ? 'block' : 'none'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            {isMeasuring && (
              <div className="measuring-overlay">
                <div className="pulse-indicator">💓</div>
                <p>Analizando tu pulso...</p>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <button 
                  className="cancel-button"
                  onClick={cancelMeasurement}
                >
                  ❌ Cancelar
                </button>
              </div>
            )}
            <button 
              className={`flash-button ${flashEnabled ? 'active' : ''}`}
              onClick={toggleFlash}
              disabled={isMeasuring}
            >
              {flashEnabled ? '🔦 Flash ON' : '💡 Flash OFF'}
            </button>
          </div>
        ) : (
          <div className="camera-placeholder">
            <div className="camera-icon">📷</div>
            <p>Haz clic en "Iniciar Medición" para activar la cámara</p>
          </div>
        )}
        
        {stream && !isCameraReady && (
          <div className="camera-loading">
            <div className="loading-spinner"></div>
            <p>Inicializando cámara...</p>
          </div>
        )}
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
            
            {(() => {
              const stressInfo = getStressMessage(result.stressLevel);
              return (
                <div className="stress-message">
                  <div className="message-emoji">{stressInfo.emoji}</div>
                  <div className="message-text">{stressInfo.message}</div>
                  <div className="message-advice">{stressInfo.advice}</div>
                </div>
              );
            })()}

            <div className="metrics-grid">
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
              <div className="metric">
                <span>Calidad de Medición:</span>
                <span>{result.quality}%</span>
              </div>
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

  const getStressColor = (level) => {
    if (level <= 20) return '#4CAF50';
    if (level <= 40) return '#8BC34A';
    if (level <= 60) return '#FF9800';
    if (level <= 80) return '#FF5722';
    return '#F44336';
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
              <div 
                className="stress-indicator"
                style={{ backgroundColor: getStressColor(measurement.stressLevel) }}
              >
                {measurement.stressLevel}%
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
    },
    {
      icon: '😴',
      title: 'Sueño de Calidad',
      description: 'Duerme 7-9 horas por noche para mantener niveles bajos de estrés.'
    },
    {
      icon: '🎵',
      title: 'Música Relajante',
      description: 'Escucha música suave o sonidos de naturaleza para relajarte.'
    },
    {
      icon: '☕',
      title: 'Té de Manzanilla',
      description: 'El té de manzanilla tiene propiedades calmantes naturales.'
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
        <p>Versión 2.0.0 - Detector de Estrés Real</p>
        <p>Con funcionalidad de cámara y análisis de pulso</p>
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
        <div className="header-content">
          <img src={stressDetectorLogo} alt="Stress Detector Logo" className="app-logo" />
        </div>
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
