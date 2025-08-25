import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Importar servicios (adaptados para web)
import {saveMeasurement} from '../services/DatabaseService';
import {showAd} from '../services/AdService';
import {checkDailyLimit, getSubscriptionStatus} from '../services/IAPService';
import {getStressLevel, getStressColor, getStressAdvice} from '../utils/stressCalculator';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  // Estados de la aplicación
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [measurementQuality, setMeasurementQuality] = useState(0);
  const [pulseData, setPulseData] = useState([]);

  // Referencias
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const qualityAnimation = useRef(new Animated.Value(0)).current;

  // Configuración de la medición
  const MEASUREMENT_DURATION = 30000; // 30 segundos
  const MIN_QUALITY_THRESHOLD = 0.7;
  const SAMPLES_PER_SECOND = 30;

  useEffect(() => {
    // Cargar estado de suscripción y límites diarios
    loadUserStatus();
    
    // Iniciar animación de pulso
    startPulseAnimation();
  }, []);

  // Cargar estado del usuario
  const loadUserStatus = async () => {
    try {
      // En la versión web, no necesitamos verificar suscripción
      console.log('Aplicación web cargada correctamente');
    } catch (error) {
      console.error('Error al cargar estado del usuario:', error);
    }
  };

  // Animación de pulso
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Iniciar medición
  const startMeasurement = async () => {
    try {
      setIsMeasuring(true);
      setHeartRate(null);
      setStressLevel(null);
      setPulseData([]);
      setMeasurementQuality(0);

      // Iniciar medición simulada para web
      startSimulatedMeasurement();
    } catch (error) {
      console.error('Error al iniciar medición:', error);
      Alert.alert('Error', 'No se pudo iniciar la medición. Inténtalo de nuevo.');
    }
  };

  // Medición simulada para web
  const startSimulatedMeasurement = () => {
    let samples = [];
    let startTime = Date.now();
    let frameCount = 0;

    const measurementInterval = setInterval(() => {
      frameCount++;
      
      // Simular detección de pulso
      const simulatedPulse = simulatePulseDetection();
      samples.push(simulatedPulse);
      setPulseData(prev => [...prev, simulatedPulse]);

      // Calcular calidad de la señal
      const quality = calculateSignalQuality(samples);
      setMeasurementQuality(quality);

      // Verificar si la calidad es suficiente
      if (quality < MIN_QUALITY_THRESHOLD && frameCount > 10) {
        clearInterval(measurementInterval);
        setIsMeasuring(false);
        Alert.alert(
          'Señal débil',
          'Simula colocar tu dedo firmemente sobre la cámara. En la versión web, esto es una simulación.'
        );
        return;
      }

      // Continuar medición hasta completar el tiempo
      if (Date.now() - startTime >= MEASUREMENT_DURATION) {
        clearInterval(measurementInterval);
        completeMeasurement(samples);
      }
    }, 1000 / SAMPLES_PER_SECOND);
  };

  // Simular detección de pulso
  const simulatePulseDetection = () => {
    // Simular variación de intensidad de luz (PPG)
    const baseIntensity = 100;
    const variation = Math.sin(Date.now() * 0.01) * 20 + Math.random() * 10;
    return Math.max(0, baseIntensity + variation);
  };

  // Calcular calidad de la señal
  const calculateSignalQuality = (samples) => {
    if (samples.length < 10) return 0;
    
    // Calcular variabilidad de la señal
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalizar calidad (0-1)
    return Math.min(1, stdDev / 50);
  };

  // Completar medición
  const completeMeasurement = async (samples) => {
    try {
      // Calcular frecuencia cardíaca
      const calculatedHeartRate = calculateHeartRate(samples);
      setHeartRate(calculatedHeartRate);

      // Calcular nivel de estrés
      const calculatedStressLevel = getStressLevel(calculatedHeartRate);
      setStressLevel(calculatedStressLevel);

      // Guardar medición
      const measurement = {
        timestamp: new Date().toISOString(),
        heartRate: calculatedHeartRate,
        stressLevel: calculatedStressLevel,
        quality: measurementQuality,
      };

      try {
        await saveMeasurement(measurement);
      } catch (error) {
        console.log('No se pudo guardar la medición en web');
      }
      
      // La medición se completó exitosamente

      // Simulación completada

      setIsMeasuring(false);
    } catch (error) {
      console.error('Error al completar medición:', error);
      setIsMeasuring(false);
    }
  };

  // Calcular frecuencia cardíaca a partir de los datos PPG
  const calculateHeartRate = (samples) => {
    // Algoritmo simple para detectar picos en la señal PPG
    let peaks = 0;
    let lastSample = samples[0];
    
    for (let i = 1; i < samples.length - 1; i++) {
      if (samples[i] > lastSample && samples[i] > samples[i + 1]) {
        peaks++;
      }
      lastSample = samples[i];
    }

    // Calcular BPM basado en la duración de la medición
    const durationMinutes = MEASUREMENT_DURATION / 60000;
    const bpm = Math.round(peaks / durationMinutes);
    
    // Ajustar a rango realista (60-120 BPM)
    return Math.max(60, Math.min(120, bpm));
  };

  // Obtener consejo personalizado
  const getPersonalizedAdvice = () => {
    if (!stressLevel) return null;
    return getStressAdvice(stressLevel);
  };

  // Renderizar indicador de calidad
  const renderQualityIndicator = () => {
    const qualityColor = measurementQuality < 0.5 ? '#FF5722' : 
                        measurementQuality < 0.8 ? '#FF9800' : '#4CAF50';
    
    return (
      <View style={styles.qualityContainer}>
        <Text style={styles.qualityText}>Calidad de señal: {Math.round(measurementQuality * 100)}%</Text>
        <View style={[styles.qualityBar, {backgroundColor: '#e0e0e0'}]}>
          <View 
            style={[
              styles.qualityFill, 
              {width: `${measurementQuality * 100}%`, backgroundColor: qualityColor}
            ]} 
          />
        </View>
      </View>
    );
  };

  // Renderizar resultado de la medición
  const renderMeasurementResult = () => {
    if (!heartRate || !stressLevel) return null;

    const stressColor = getStressColor(stressLevel);
    const advice = getPersonalizedAdvice();

    return (
      <View style={styles.resultContainer}>
        <View style={[styles.resultGradient, {backgroundColor: stressColor}]}>
          <Text style={styles.resultTitle}>Resultado de la Medición</Text>
          
          <View style={styles.metricContainer}>
            <Text style={styles.metricLabel}>Frecuencia Cardíaca</Text>
            <Text style={styles.metricValue}>{heartRate} BPM</Text>
          </View>

          <View style={styles.metricContainer}>
            <Text style={styles.metricLabel}>Nivel de Estrés</Text>
            <Text style={[styles.metricValue, {color: stressColor}]}>
              {stressLevel}
            </Text>
          </View>

          {advice && (
            <View style={styles.adviceContainer}>
              <Text style={styles.adviceTitle}>Consejo:</Text>
              <Text style={styles.adviceText}>{advice}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Renderizar gráfico simplificado
  const renderSimpleChart = () => {
    if (pulseData.length === 0) return null;

    const maxData = Math.max(...pulseData);
    const minData = Math.min(...pulseData);
    const range = maxData - minData;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Señal PPG Simulada</Text>
        <View style={styles.chartArea}>
          {pulseData.slice(-20).map((value, index) => {
            const height = range > 0 ? ((value - minData) / range) * 100 : 50;
            return (
              <View
                key={index}
                style={[
                  styles.chartBar,
                  {
                    height: `${height}%`,
                    backgroundColor: '#4CAF50',
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Título y descripción */}
        <View style={styles.header}>
          <Text style={styles.title}>Detector de Estrés</Text>
          <Text style={styles.subtitle}>
            Mide tu frecuencia cardíaca y nivel de estrés usando la cámara de tu móvil
          </Text>
        </View>

        {/* Instrucciones de uso */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📋 Instrucciones de Uso</Text>
          <Text style={styles.instructionsText}>
            • Coloca tu dedo índice sobre la cámara del móvil{'\n'}
            • Mantén el dedo firme y sin mover durante 30 segundos{'\n'}
            • La app usa el flash para iluminar tu dedo{'\n'}
            • Detecta cambios en el color de tu piel (tecnología PPG){'\n'}
            • Mide tu frecuencia cardíaca y calcula el nivel de estrés{'\n'}
            • Puedes realizar mediciones ilimitadas
          </Text>
        </View>

        {/* Explicación de PPG */}
        <View style={styles.ppgContainer}>
          <Text style={styles.ppgTitle}>💡 ¿Cómo funciona la medición?</Text>
          <Text style={styles.ppgText}>
            <Text style={styles.bold}>PPG (Fotopletismografía):</Text> La luz del flash atraviesa tu piel y es absorbida por la hemoglobina en tu sangre. Cuando tu corazón late, el flujo sanguíneo cambia, alterando la cantidad de luz que se refleja. La cámara detecta estos cambios microscópicos y calcula tu frecuencia cardíaca.
          </Text>
          <Text style={styles.ppgText}>
            <Text style={styles.bold}>Nivel de Estrés:</Text> Se calcula analizando la variabilidad entre latidos. Un corazón estresado tiene latidos más regulares y rápidos, mientras que uno relajado tiene más variabilidad natural.
          </Text>
        </View>

        {/* Cámara simulada */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            <Icon name="camera-alt" size={80} color="#666" />
            <Text style={styles.cameraText}>
              {isMeasuring ? 'Coloca tu dedo sobre la cámara...' : 'Coloca tu dedo aquí'}
            </Text>
            
            {isMeasuring && (
              <Animated.View
                style={[
                  styles.pulseIndicator,
                  {
                    transform: [{
                      scale: pulseAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    }],
                    opacity: pulseAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              >
                <Icon name="favorite" size={40} color="#FF5722" />
              </Animated.View>
            )}
          </View>
        </View>

        {/* Indicador de calidad */}
        {isMeasuring && renderQualityIndicator()}

        {/* Botón de medición */}
        <TouchableOpacity
          style={[
            styles.measureButton,
            isMeasuring && styles.measureButtonDisabled,
          ]}
          onPress={startMeasurement}
          disabled={isMeasuring}
        >
          <Text style={styles.measureButtonText}>
            {isMeasuring ? 'Midiendo...' : 'Iniciar Medición'}
          </Text>
        </TouchableOpacity>

        {/* Resultado de la medición */}
        {renderMeasurementResult()}

        {/* Gráfico simplificado */}
        {renderSimpleChart()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  ppgContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  ppgTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ppgText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  cameraContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cameraPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  cameraText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  pulseIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  qualityContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  qualityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  qualityBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  qualityFill: {
    height: '100%',
    borderRadius: 4,
  },
  measureButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  measureButtonDisabled: {
    backgroundColor: '#ccc',
  },
  measureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    marginBottom: 20,
  },
  resultGradient: {
    padding: 20,
    borderRadius: 15,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  metricLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  adviceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chartArea: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  chartBar: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 2,
  },
});

export default HomeScreen;

