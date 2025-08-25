import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getMeasurements, deleteMeasurement} from '../services/DatabaseService';
import {getStressColor} from '../utils/stressCalculator';

const HistoryScreen = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = async () => {
    try {
      const data = await getMeasurements();
      setMeasurements(data || []);
    } catch (error) {
      console.log('No se pudieron cargar las mediciones en web');
      // Datos de ejemplo para web
      setMeasurements([
        {
          id: 1,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          heartRate: 75,
          stressLevel: 'Bajo',
          quality: 0.85,
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          heartRate: 82,
          stressLevel: 'Moderado',
          quality: 0.78,
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          heartRate: 68,
          stressLevel: 'Bajo',
          quality: 0.92,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeasurement = async (id) => {
    Alert.alert(
      'Eliminar medición',
      '¿Estás seguro de que quieres eliminar esta medición?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeasurement(id);
              setMeasurements(prev => prev.filter(m => m.id !== id));
            } catch (error) {
              console.log('No se pudo eliminar la medición en web');
              // Simular eliminación para web
              setMeasurements(prev => prev.filter(m => m.id !== id));
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAverageHeartRate = () => {
    if (measurements.length === 0) return 0;
    const sum = measurements.reduce((acc, m) => acc + m.heartRate, 0);
    return Math.round(sum / measurements.length);
  };

  const getAverageStressLevel = () => {
    if (measurements.length === 0) return 'N/A';
    const levels = measurements.map(m => m.stressLevel);
    const low = levels.filter(l => l === 'Bajo').length;
    const moderate = levels.filter(l => l === 'Moderado').length;
    const high = levels.filter(l => l === 'Alto').length;
    
    if (low >= moderate && low >= high) return 'Bajo';
    if (moderate >= high) return 'Moderado';
    return 'Alto';
  };

  const renderMeasurementCard = (measurement) => {
    const stressColor = getStressColor(measurement.stressLevel);
    
    return (
      <View key={measurement.id} style={styles.measurementCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{formatDate(measurement.timestamp)}</Text>
          <TouchableOpacity
            onPress={() => handleDeleteMeasurement(measurement.id)}
            style={styles.deleteButton}
          >
            <Icon name="delete" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.metricRow}>
            <View style={styles.metric}>
              <Icon name="favorite" size={20} color="#FF5722" />
              <Text style={styles.metricLabel}>Frecuencia</Text>
              <Text style={styles.metricValue}>{measurement.heartRate} BPM</Text>
            </View>
            
            <View style={styles.metric}>
              <Icon name="trending-up" size={20} color={stressColor} />
              <Text style={styles.metricLabel}>Estrés</Text>
              <Text style={[styles.metricValue, {color: stressColor}]}>
                {measurement.stressLevel}
              </Text>
            </View>
            
            <View style={styles.metric}>
              <Icon name="signal-cellular-alt" size={20} color="#4CAF50" />
              <Text style={styles.metricLabel}>Calidad</Text>
              <Text style={styles.metricValue}>
                {Math.round(measurement.quality * 100)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderStatistics = () => {
    const avgHeartRate = getAverageHeartRate();
    const avgStressLevel = getAverageStressLevel();
    
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas Generales</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="analytics" size={30} color="#4CAF50" />
            <Text style={styles.statLabel}>Total Mediciones</Text>
            <Text style={styles.statValue}>{measurements.length}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="favorite" size={30} color="#FF5722" />
            <Text style={styles.statLabel}>Promedio BPM</Text>
            <Text style={styles.statValue}>{avgHeartRate}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="trending-up" size={30} color="#FF9800" />
            <Text style={styles.statLabel}>Nivel Promedio</Text>
            <Text style={styles.statValue}>{avgStressLevel}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSimpleChart = () => {
    if (measurements.length < 2) return null;
    
    const chartData = measurements.slice(-10).reverse(); // Últimas 10 mediciones
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tendencia de Frecuencia Cardíaca</Text>
        <View style={styles.chartArea}>
          {chartData.map((measurement, index) => {
            const height = ((measurement.heartRate - 60) / 60) * 100; // Normalizar entre 60-120 BPM
            return (
              <View key={index} style={styles.chartColumn}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${Math.max(10, Math.min(100, height))}%`,
                      backgroundColor: getStressColor(measurement.stressLevel),
                    },
                  ]}
                />
                <Text style={styles.chartLabel}>{measurement.heartRate}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Historial de Mediciones</Text>
          <Text style={styles.subtitle}>
            Revisa tus mediciones anteriores y estadísticas
          </Text>
        </View>

        {renderStatistics()}
        
        {renderSimpleChart()}

        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>Mediciones Recientes</Text>
          
          {measurements.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="history" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No hay mediciones registradas</Text>
              <Text style={styles.emptySubtext}>
                Realiza tu primera medición para ver el historial aquí
              </Text>
            </View>
          ) : (
            measurements.map(renderMeasurementCard)
          )}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
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
    height: 200,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  chartLabel: {
    fontSize: 10,
    color: '#666',
  },
  measurementsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  measurementCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
  cardContent: {
    flex: 1,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HistoryScreen;

