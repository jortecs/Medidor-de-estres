# Detector de Estrés

Una aplicación web para medir y gestionar el nivel de estrés mediante la simulación de medición de frecuencia cardíaca.

## 🌟 Características

- **Medición Simulada**: Simula la medición de frecuencia cardíaca y nivel de estrés
- **Mediciones Ilimitadas**: Sin restricciones de uso diario
- **Instrucciones Detalladas**: Guía completa sobre el uso de la cámara y flash
- **Historial**: Visualiza tus mediciones anteriores con estadísticas
- **Consejos**: Accede a técnicas de relajación y gestión del estrés
- **Configuración**: Personaliza tu experiencia con la aplicación
- **Interfaz Responsiva**: Funciona perfectamente en dispositivos móviles y de escritorio

## 🚀 Demo en Vivo

Visita la aplicación en: [https://jortecs.github.io/Medidor-de-estres](https://jortecs.github.io/Medidor-de-estres)

## 🛠️ Tecnologías Utilizadas

- **React**: Framework principal
- **React Native Web**: Para compatibilidad con componentes móviles
- **React Navigation**: Navegación entre pantallas
- **React Native Vector Icons**: Iconografía
- **React Native Chart Kit**: Gráficos y visualizaciones
- **GitHub Pages**: Hosting y despliegue automático

## 📱 Pantallas

### 🏠 Pantalla Principal
- Simulación de medición de frecuencia cardíaca
- **Instrucciones detalladas de uso con cámara y flash**
- Indicador de calidad de señal
- Resultados en tiempo real
- Gráfico de señal PPG
- **Mediciones ilimitadas sin restricciones**

### 📊 Historial
- Lista de mediciones anteriores
- Estadísticas generales
- Gráfico de tendencias
- Opción de eliminar mediciones

### 💡 Consejos
- Técnicas de respiración
- Meditación mindfulness
- Ejercicio físico
- Gestión del tiempo
- Y mucho más...

### ⚙️ Configuración
- Perfil de usuario
- Notificaciones
- Preferencias de la aplicación
- Gestión de datos
- Información de la app

## 📋 Instrucciones de Uso

### Cómo usar el medidor con la cámara y flash:

1. **Prepara tu dispositivo:**
   - Asegúrate de que la cámara y el flash estén limpios
   - Coloca el dispositivo en una superficie estable
   - Mantén el dispositivo a temperatura ambiente

2. **Posiciona tu dedo:**
   - Usa tu dedo índice de la mano dominante
   - Coloca el dedo firmemente sobre la cámara
   - Cubre completamente la lente de la cámara
   - El flash debe iluminar tu dedo desde atrás

3. **Durante la medición:**
   - Mantén el dedo completamente inmóvil
   - No presiones demasiado fuerte
   - Respira normalmente
   - Evita hablar o movimientos bruscos

4. **¿Cómo funciona?**
   - El flash ilumina tu dedo con luz blanca
   - La cámara detecta cambios en el color de tu piel
   - Estos cambios corresponden a tu pulso sanguíneo
   - La app calcula tu frecuencia cardíaca y nivel de estrés

### Tecnología PPG (Fotopletismografía):
La aplicación utiliza la tecnología PPG para medir tu frecuencia cardíaca. El flash ilumina tu dedo y la cámara detecta los cambios microscópicos en el color de tu piel que ocurren con cada latido del corazón. Estos datos se procesan para calcular tu nivel de estrés basado en la variabilidad de tu frecuencia cardíaca.

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/jortecs/Medidor-de-estres.git
   cd Medidor-de-estres
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 🌐 Despliegue

La aplicación se despliega automáticamente a GitHub Pages cuando se hace push a la rama `main`.

### Despliegue Manual

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Desplegar a GitHub Pages**
   ```bash
   npm run deploy
   ```

## 📁 Estructura del Proyecto

```
src/
├── App.js                 # Componente principal
├── index.js              # Punto de entrada web
├── screens/              # Pantallas de la aplicación
│   ├── HomeScreen.js     # Pantalla principal
│   ├── HistoryScreen.js  # Historial de mediciones
│   ├── TipsScreen.js     # Consejos y técnicas
│   └── SettingsScreen.js # Configuración
├── services/             # Servicios de la aplicación
│   ├── DatabaseService.js
│   ├── AdService.js
│   ├── IAPService.js
│   └── StorageService.js
└── utils/                # Utilidades
    └── stressCalculator.js
```

## 🔧 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run deploy`: Despliega a GitHub Pages
- `npm run android`: Ejecuta en Android (React Native)
- `npm run ios`: Ejecuta en iOS (React Native)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Autor**: Jorge
- **GitHub**: [@jortecs](https://github.com/jortecs)
- **Repositorio**: [https://github.com/jortecs/Medidor-de-estres](https://github.com/jortecs/Medidor-de-estres)

## 🙏 Agradecimientos

- React Native Web por la compatibilidad multiplataforma
- React Navigation por el sistema de navegación
- GitHub Pages por el hosting gratuito
- La comunidad de React por las herramientas y librerías

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

