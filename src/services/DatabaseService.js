// Versión web del DatabaseService usando localStorage

const STORAGE_KEY = 'detector_estres_data';

// Simular base de datos con localStorage
let measurements = [];

// Inicializar base de datos
export const initDatabase = async () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      measurements = JSON.parse(storedData);
    }
    console.log('Base de datos web inicializada');
    return true;
  } catch (error) {
    console.error('Error al inicializar base de datos web:', error);
    return false;
  }
};

// Guardar medición
export const saveMeasurement = async (measurement) => {
  try {
    const newMeasurement = {
      id: Date.now(),
      ...measurement,
      created_at: new Date().toISOString(),
    };
    
    measurements.push(newMeasurement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    
    console.log('Medición guardada en web:', newMeasurement);
    return { success: true, id: newMeasurement.id };
  } catch (error) {
    console.error('Error al guardar medición en web:', error);
    return { success: false, error: error.message };
  }
};

// Obtener mediciones
export const getMeasurements = async (limit = 100) => {
  try {
    const sortedMeasurements = measurements
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return sortedMeasurements;
  } catch (error) {
    console.error('Error al obtener mediciones en web:', error);
    return [];
  }
};

// Eliminar medición
export const deleteMeasurement = async (id) => {
  try {
    measurements = measurements.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    
    console.log('Medición eliminada en web:', id);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar medición en web:', error);
    return { success: false, error: error.message };
  }
};

// Obtener estadísticas semanales
export const getWeeklyStats = async (days = 7) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    const weeklyMeasurements = measurements.filter(m => 
      new Date(m.timestamp) >= weekAgo
    );
    
    // Agrupar por día
    const dailyStats = {};
    weeklyMeasurements.forEach(m => {
      const date = new Date(m.timestamp).toDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date: new Date(m.timestamp).toLocaleDateString(),
          count: 0,
          avgHeartRate: 0,
          totalHeartRate: 0,
        };
      }
      dailyStats[date].count++;
      dailyStats[date].totalHeartRate += m.heartRate;
    });
    
    // Calcular promedios
    Object.values(dailyStats).forEach(stat => {
      stat.avgHeartRate = Math.round(stat.totalHeartRate / stat.count);
    });
    
    return Object.values(dailyStats);
  } catch (error) {
    console.error('Error al obtener estadísticas semanales en web:', error);
    return [];
  }
};

// Limpiar todos los datos
export const clearAllData = async () => {
  try {
    measurements = [];
    localStorage.removeItem(STORAGE_KEY);
    console.log('Todos los datos eliminados en web');
    return { success: true };
  } catch (error) {
    console.error('Error al limpiar datos en web:', error);
    return { success: false, error: error.message };
  }
};

// Exportar datos
export const exportData = async () => {
  try {
    const data = {
      measurements,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detector-estres-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Datos exportados en web');
    return { success: true };
  } catch (error) {
    console.error('Error al exportar datos en web:', error);
    return { success: false, error: error.message };
  }
};

