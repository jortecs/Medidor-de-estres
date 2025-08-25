import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    autoSave: true,
    darkMode: false,
    premium: false,
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Usuario',
    email: 'usuario@ejemplo.com',
    age: 30,
    gender: 'No especificado',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // En una implementación real, cargar desde AsyncStorage
      console.log('Configuración cargada');
    } catch (error) {
      console.log('No se pudieron cargar las configuraciones en web');
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Datos',
      '¿Deseas exportar todos tus datos de medición?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Exportar',
          onPress: () => {
            // Simular exportación
            Alert.alert('Éxito', 'Datos exportados correctamente');
          },
        },
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Eliminar Datos',
      '¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Datos Eliminados', 'Todos los datos han sido eliminados');
          },
        },
      ]
    );
  };

  const renderSettingItem = (icon, title, subtitle, type, key, value) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={24} color="#4CAF50" />
        </View>
        
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={(newValue) => updateSetting(key, newValue)}
            trackColor={{false: '#e0e0e0', true: '#4CAF50'}}
            thumbColor={value ? '#fff' : '#f4f3f4'}
          />
        )}
        
        {type === 'arrow' && (
          <Icon name="chevron-right" size={24} color="#ccc" />
        )}
      </View>
    );
  };

  const renderSection = (title, children) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>
          {children}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>
            Personaliza tu experiencia con la aplicación
          </Text>
        </View>

        {/* Perfil de Usuario */}
        {renderSection('Perfil de Usuario', (
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Icon name="person" size={40} color="#fff" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Notificaciones */}
        {renderSection('Notificaciones', (
          <>
            {renderSettingItem(
              'notifications',
              'Notificaciones',
              'Recibe recordatorios para medir tu estrés',
              'switch',
              'notifications',
              settings.notifications
            )}
            {renderSettingItem(
              'volume-up',
              'Sonidos',
              'Reproducir sonidos en las notificaciones',
              'switch',
              'soundEnabled',
              settings.soundEnabled
            )}
            {renderSettingItem(
              'vibration',
              'Vibración',
              'Vibrar al recibir notificaciones',
              'switch',
              'vibrationEnabled',
              settings.vibrationEnabled
            )}
          </>
        ))}

        {/* Aplicación */}
        {renderSection('Aplicación', (
          <>
            {renderSettingItem(
              'save',
              'Guardado Automático',
              'Guardar mediciones automáticamente',
              'switch',
              'autoSave',
              settings.autoSave
            )}
            {renderSettingItem(
              'dark-mode',
              'Modo Oscuro',
              'Cambiar entre tema claro y oscuro',
              'switch',
              'darkMode',
              settings.darkMode
            )}
            {renderSettingItem(
              'language',
              'Idioma',
              'Español',
              'arrow'
            )}
            {renderSettingItem(
              'accessibility',
              'Accesibilidad',
              'Configurar opciones de accesibilidad',
              'arrow'
            )}
          </>
        ))}

        {/* Datos */}
        {renderSection('Datos', (
          <>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleExportData}
            >
              <View style={styles.settingIcon}>
                <Icon name="file-download" size={24} color="#4CAF50" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Exportar Datos</Text>
                <Text style={styles.settingSubtitle}>Descargar todas tus mediciones</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleDeleteData}
            >
              <View style={styles.settingIcon}>
                <Icon name="delete-forever" size={24} color="#FF5722" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, {color: '#FF5722'}]}>
                  Eliminar Datos
                </Text>
                <Text style={styles.settingSubtitle}>
                  Eliminar todas las mediciones
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          </>
        ))}

        {/* Premium */}
        {!settings.premium && renderSection('Premium', (
          <View style={styles.premiumCard}>
            <Icon name="star" size={40} color="#FFD700" />
            <Text style={styles.premiumTitle}>Actualiza a Premium</Text>
            <Text style={styles.premiumDescription}>
              Desbloquea funciones avanzadas, estadísticas detalladas y mediciones ilimitadas
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Ver Planes</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Información */}
        {renderSection('Información', (
          <>
            {renderSettingItem(
              'info',
              'Acerca de',
              'Información de la aplicación',
              'arrow'
            )}
            {renderSettingItem(
              'privacy-tip',
              'Privacidad',
              'Política de privacidad y términos',
              'arrow'
            )}
            {renderSettingItem(
              'help',
              'Ayuda y Soporte',
              'Centro de ayuda y contacto',
              'arrow'
            )}
            {renderSettingItem(
              'rate-review',
              'Calificar App',
              'Deja tu opinión en la tienda',
              'arrow'
            )}
          </>
        ))}

        {/* Versión */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  profileCard: {
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editProfileButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  premiumCard: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  premiumButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SettingsScreen;

