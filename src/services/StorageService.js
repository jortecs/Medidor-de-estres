// Versión web del StorageService usando localStorage

const STORAGE_KEYS = {
  USER_PREFERENCES: 'detector_estres_preferences',
  MEASUREMENT_SETTINGS: 'detector_estres_measurement_settings',
  APP_SETTINGS: 'detector_estres_app_settings',
  USER_PROFILE: 'detector_estres_user_profile',
};

// Preferencias por defecto
const DEFAULT_PREFERENCES = {
  notifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
  autoSave: true,
  darkMode: false,
  language: 'es',
  measurementDuration: 30,
  qualityThreshold: 0.7,
  dailyReminders: true,
  reminderTime: '09:00',
  dataSharing: false,
  autoBackup: true,
};

// Configuración de medición por defecto
const DEFAULT_MEASUREMENT_SETTINGS = {
  duration: 30000, // 30 segundos
  minQualityThreshold: 0.7,
  samplesPerSecond: 30,
  autoSave: true,
  showRealTimeGraph: true,
  enableVibration: true,
};

// Configuración de la aplicación por defecto
const DEFAULT_APP_SETTINGS = {
  firstLaunch: true,
  appVersion: '1.0.0',
  lastUpdateCheck: null,
  analyticsEnabled: false,
  crashReportingEnabled: false,
  betaFeatures: false,
};

// Perfil de usuario por defecto
const DEFAULT_USER_PROFILE = {
  name: 'Usuario',
  email: '',
  age: null,
  gender: 'no_specified',
  height: null,
  weight: null,
  activityLevel: 'moderate',
  stressLevel: 'unknown',
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

// Cargar preferencias del usuario
export const loadUserPreferences = async () => {
  try {
    const storedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);
      // Combinar con valores por defecto para asegurar compatibilidad
      return { ...DEFAULT_PREFERENCES, ...preferences };
    }
    
    // Si no hay preferencias guardadas, usar valores por defecto
    await saveUserPreferences(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error al cargar preferencias del usuario en web:', error);
    return DEFAULT_PREFERENCES;
  }
};

// Guardar preferencias del usuario
export const saveUserPreferences = async (preferences) => {
  try {
    const preferencesToSave = { ...DEFAULT_PREFERENCES, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferencesToSave));
    console.log('Preferencias del usuario guardadas en web');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar preferencias del usuario en web:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar una preferencia específica
export const updateUserPreference = async (key, value) => {
  try {
    const currentPreferences = await loadUserPreferences();
    const updatedPreferences = { ...currentPreferences, [key]: value };
    await saveUserPreferences(updatedPreferences);
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar preferencia en web:', error);
    return { success: false, error: error.message };
  }
};

// Cargar configuración de medición
export const loadMeasurementSettings = async () => {
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.MEASUREMENT_SETTINGS);
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      return { ...DEFAULT_MEASUREMENT_SETTINGS, ...settings };
    }
    
    await saveMeasurementSettings(DEFAULT_MEASUREMENT_SETTINGS);
    return DEFAULT_MEASUREMENT_SETTINGS;
  } catch (error) {
    console.error('Error al cargar configuración de medición en web:', error);
    return DEFAULT_MEASUREMENT_SETTINGS;
  }
};

// Guardar configuración de medición
export const saveMeasurementSettings = async (settings) => {
  try {
    const settingsToSave = { ...DEFAULT_MEASUREMENT_SETTINGS, ...settings };
    localStorage.setItem(STORAGE_KEYS.MEASUREMENT_SETTINGS, JSON.stringify(settingsToSave));
    console.log('Configuración de medición guardada en web');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar configuración de medición en web:', error);
    return { success: false, error: error.message };
  }
};

// Cargar configuración de la aplicación
export const loadAppSettings = async () => {
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      return { ...DEFAULT_APP_SETTINGS, ...settings };
    }
    
    await saveAppSettings(DEFAULT_APP_SETTINGS);
    return DEFAULT_APP_SETTINGS;
  } catch (error) {
    console.error('Error al cargar configuración de la aplicación en web:', error);
    return DEFAULT_APP_SETTINGS;
  }
};

// Guardar configuración de la aplicación
export const saveAppSettings = async (settings) => {
  try {
    const settingsToSave = { ...DEFAULT_APP_SETTINGS, ...settings };
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settingsToSave));
    console.log('Configuración de la aplicación guardada en web');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar configuración de la aplicación en web:', error);
    return { success: false, error: error.message };
  }
};

// Cargar perfil del usuario
export const loadUserProfile = async () => {
  try {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      return { ...DEFAULT_USER_PROFILE, ...profile };
    }
    
    await saveUserProfile(DEFAULT_USER_PROFILE);
    return DEFAULT_USER_PROFILE;
  } catch (error) {
    console.error('Error al cargar perfil del usuario en web:', error);
    return DEFAULT_USER_PROFILE;
  }
};

// Guardar perfil del usuario
export const saveUserProfile = async (profile) => {
  try {
    const profileToSave = { 
      ...DEFAULT_USER_PROFILE, 
      ...profile, 
      lastUpdated: new Date().toISOString() 
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profileToSave));
    console.log('Perfil del usuario guardado en web');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar perfil del usuario en web:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (updates) => {
  try {
    const currentProfile = await loadUserProfile();
    const updatedProfile = { ...currentProfile, ...updates };
    await saveUserProfile(updatedProfile);
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar perfil del usuario en web:', error);
    return { success: false, error: error.message };
  }
};

// Limpiar todos los datos almacenados
export const clearAllStorage = async () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('Todos los datos de almacenamiento limpiados en web');
    return { success: true };
  } catch (error) {
    console.error('Error al limpiar almacenamiento en web:', error);
    return { success: false, error: error.message };
  }
};

// Exportar todos los datos almacenados
export const exportStorageData = async () => {
  try {
    const data = {
      preferences: await loadUserPreferences(),
      measurementSettings: await loadMeasurementSettings(),
      appSettings: await loadAppSettings(),
      userProfile: await loadUserProfile(),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detector-estres-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Datos de configuración exportados en web');
    return { success: true };
  } catch (error) {
    console.error('Error al exportar datos de configuración en web:', error);
    return { success: false, error: error.message };
  }
};

// Importar datos de configuración
export const importStorageData = async (data) => {
  try {
    if (data.preferences) {
      await saveUserPreferences(data.preferences);
    }
    if (data.measurementSettings) {
      await saveMeasurementSettings(data.measurementSettings);
    }
    if (data.appSettings) {
      await saveAppSettings(data.appSettings);
    }
    if (data.userProfile) {
      await saveUserProfile(data.userProfile);
    }
    
    console.log('Datos de configuración importados en web');
    return { success: true };
  } catch (error) {
    console.error('Error al importar datos de configuración en web:', error);
    return { success: false, error: error.message };
  }
};

// Verificar si es la primera vez que se ejecuta la app
export const isFirstLaunch = async () => {
  try {
    const appSettings = await loadAppSettings();
    return appSettings.firstLaunch;
  } catch (error) {
    console.error('Error al verificar primera ejecución en web:', error);
    return true;
  }
};

// Marcar que ya no es la primera ejecución
export const markFirstLaunchComplete = async () => {
  try {
    const appSettings = await loadAppSettings();
    appSettings.firstLaunch = false;
    await saveAppSettings(appSettings);
    return { success: true };
  } catch (error) {
    console.error('Error al marcar primera ejecución completada en web:', error);
    return { success: false, error: error.message };
  }
};

// Obtener estadísticas de almacenamiento
export const getStorageStats = () => {
  try {
    const stats = {
      totalSize: 0,
      items: {},
    };
    
    Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
      const item = localStorage.getItem(value);
      if (item) {
        const size = new Blob([item]).size;
        stats.items[key] = {
          size,
          exists: true,
        };
        stats.totalSize += size;
      } else {
        stats.items[key] = {
          size: 0,
          exists: false,
        };
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas de almacenamiento en web:', error);
    return { totalSize: 0, items: {} };
  }
};

