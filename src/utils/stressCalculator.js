// Utilidades para calcular el nivel de estrés basado en datos fisiológicos

// Rangos de frecuencia cardíaca por edad (BPM)
const HEART_RATE_RANGES = {
  // Rango normal en reposo por edad
  normal: {
    '18-25': { min: 60, max: 100 },
    '26-35': { min: 60, max: 100 },
    '36-45': { min: 60, max: 100 },
    '46-55': { min: 60, max: 100 },
    '56-65': { min: 60, max: 100 },
    '65+': { min: 60, max: 100 },
  },
  
  // Rango de ejercicio moderado
  moderate: {
    '18-25': { min: 100, max: 150 },
    '26-35': { min: 95, max: 145 },
    '36-45': { min: 90, max: 140 },
    '46-55': { min: 85, max: 135 },
    '56-65': { min: 80, max: 130 },
    '65+': { min: 75, max: 125 },
  },
  
  // Rango de ejercicio intenso
  intense: {
    '18-25': { min: 150, max: 200 },
    '26-35': { min: 145, max: 195 },
    '36-45': { min: 140, max: 190 },
    '46-55': { min: 135, max: 185 },
    '56-65': { min: 130, max: 180 },
    '65+': { min: 125, max: 175 },
  },
};

// Factores que influyen en el nivel de estrés
const STRESS_FACTORS = {
  heartRate: 0.4,        // Frecuencia cardíaca (40% del peso)
  variability: 0.3,      // Variabilidad del pulso (30% del peso)
  quality: 0.2,          // Calidad de la señal (20% del peso)
  trend: 0.1,            // Tendencia temporal (10% del peso)
};

// Umbrales para clasificar niveles de estrés
const STRESS_THRESHOLDS = {
  low: 0.3,      // 0-30%: Estrés bajo
  medium: 0.6,   // 31-60%: Estrés medio
  high: 1.0,     // 61-100%: Estrés alto
};

// Calcular nivel de estrés basado en frecuencia cardíaca
export const getStressLevel = (heartRate, age = 30, additionalFactors = {}) => {
  try {
    // Validar entrada
    if (!heartRate || heartRate < 40 || heartRate > 200) {
      throw new Error('Frecuencia cardíaca inválida');
    }
    
    // Obtener rango de edad
    const ageRange = getAgeRange(age);
    
    // Calcular puntuación de estrés por frecuencia cardíaca
    const heartRateScore = calculateHeartRateScore(heartRate, ageRange);
    
    // Calcular puntuación de variabilidad (si se proporciona)
    const variabilityScore = additionalFactors.variability || 0.5;
    
    // Calcular puntuación de calidad de señal (si se proporciona)
    const qualityScore = additionalFactors.quality || 0.8;
    
    // Calcular puntuación de tendencia (si se proporciona)
    const trendScore = additionalFactors.trend || 0.5;
    
    // Calcular puntuación total ponderada
    const totalScore = (
      heartRateScore * STRESS_FACTORS.heartRate +
      variabilityScore * STRESS_FACTORS.variability +
      qualityScore * STRESS_FACTORS.quality +
      trendScore * STRESS_FACTORS.trend
    );
    
    // Clasificar nivel de estrés
    const stressLevel = classifyStressLevel(totalScore);
    
    return stressLevel;
  } catch (error) {
    console.error('Error al calcular nivel de estrés:', error);
    return 'medio'; // Valor por defecto en caso de error
  }
};

// Obtener rango de edad
const getAgeRange = (age) => {
  if (age < 18) return '18-25';
  if (age <= 25) return '18-25';
  if (age <= 35) return '26-35';
  if (age <= 45) return '36-45';
  if (age <= 55) return '46-55';
  if (age <= 65) return '56-65';
  return '65+';
};

// Calcular puntuación de estrés basada en frecuencia cardíaca
const calculateHeartRateScore = (heartRate, ageRange) => {
  const normalRange = HEART_RATE_RANGES.normal[ageRange];
  const moderateRange = HEART_RATE_RANGES.moderate[ageRange];
  
  // Si está en rango normal, puntuación baja
  if (heartRate >= normalRange.min && heartRate <= normalRange.max) {
    return 0.2; // 20% de estrés
  }
  
  // Si está por debajo del rango normal, puntuación media-baja
  if (heartRate < normalRange.min) {
    const deviation = (normalRange.min - heartRate) / normalRange.min;
    return Math.min(0.4, 0.2 + deviation * 0.2);
  }
  
  // Si está por encima del rango normal
  if (heartRate > normalRange.max) {
    // Si está en rango moderado
    if (heartRate <= moderateRange.max) {
      const deviation = (heartRate - normalRange.max) / (moderateRange.max - normalRange.max);
      return 0.2 + deviation * 0.3; // 20% a 50%
    }
    
    // Si está en rango intenso o superior
    const deviation = (heartRate - moderateRange.max) / (moderateRange.max * 0.5);
    return Math.min(1.0, 0.5 + deviation * 0.5); // 50% a 100%
  }
  
  return 0.5; // Valor por defecto
};

// Clasificar nivel de estrés basado en puntuación
const classifyStressLevel = (score) => {
  if (score <= STRESS_THRESHOLDS.low) {
    return 'bajo';
  } else if (score <= STRESS_THRESHOLDS.medium) {
    return 'medio';
  } else {
    return 'alto';
  }
};

// Obtener color asociado al nivel de estrés
export const getStressColor = (stressLevel) => {
  switch (stressLevel.toLowerCase()) {
    case 'bajo':
      return '#4CAF50'; // Verde
    case 'medio':
      return '#FF9800'; // Naranja
    case 'alto':
      return '#F44336'; // Rojo
    default:
      return '#666666'; // Gris
  }
};

// Obtener consejo personalizado basado en el nivel de estrés
export const getStressAdvice = (stressLevel) => {
  const advice = {
    bajo: [
      'Mantén tu rutina actual, estás en un excelente nivel de bienestar',
      'Continúa con actividades que te relajen y te hagan feliz',
      'Practica la gratitud diariamente para mantener tu estado positivo',
      'Considera compartir tus técnicas de relajación con otros',
    ],
    medio: [
      'Identifica las fuentes de estrés en tu vida diaria',
      'Practica técnicas de respiración 3 veces al día',
      'Establece límites saludables en el trabajo y relaciones',
      'Dedica 20 minutos diarios a actividades relajantes',
      'Considera reducir el consumo de cafeína y alcohol',
    ],
    alto: [
      'Prioriza el autocuidado y la relajación inmediatamente',
      'Considera buscar ayuda profesional si el estrés persiste',
      'Practica respiración de emergencia cada vez que te sientas abrumado',
      'Reduce las responsabilidades innecesarias temporalmente',
      'Establece una rutina de sueño estricta de 7-8 horas',
      'Elimina o reduce fuentes de estrés tóxicas de tu vida',
    ],
  };
  
  const level = stressLevel.toLowerCase();
  const levelAdvice = advice[level] || advice.medio;
  
  // Retornar consejo aleatorio del nivel correspondiente
  const randomIndex = Math.floor(Math.random() * levelAdvice.length);
  return levelAdvice[randomIndex];
};

// Calcular variabilidad de la frecuencia cardíaca (HRV)
export const calculateHRV = (heartRateData) => {
  try {
    if (!heartRateData || heartRateData.length < 10) {
      return 0;
    }
    
    // Calcular diferencias entre latidos consecutivos
    const differences = [];
    for (let i = 1; i < heartRateData.length; i++) {
      const diff = Math.abs(heartRateData[i] - heartRateData[i - 1]);
      differences.push(diff);
    }
    
    // Calcular desviación estándar de las diferencias
    const mean = differences.reduce((a, b) => a + b, 0) / differences.length;
    const variance = differences.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / differences.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalizar HRV (0-1)
    const normalizedHRV = Math.min(1, stdDev / 20);
    
    return normalizedHRV;
  } catch (error) {
    console.error('Error al calcular HRV:', error);
    return 0;
  }
};

// Analizar tendencia de la frecuencia cardíaca
export const analyzeHeartRateTrend = (heartRateData, timeWindow = 300) => {
  try {
    if (!heartRateData || heartRateData.length < 5) {
      return 0.5; // Tendencia neutral
    }
    
    // Tomar solo los últimos datos dentro de la ventana de tiempo
    const recentData = heartRateData.slice(-Math.min(10, heartRateData.length));
    
    // Calcular tendencia usando regresión lineal simple
    const n = recentData.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = recentData.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((a, b, i) => a + b * recentData[i], 0);
    const sumX2 = xValues.reduce((a, b) => a + b * b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Normalizar pendiente a rango 0-1
    // Pendiente positiva (aumento) = mayor estrés
    // Pendiente negativa (disminución) = menor estrés
    const normalizedTrend = Math.max(0, Math.min(1, (slope + 5) / 10));
    
    return normalizedTrend;
  } catch (error) {
    console.error('Error al analizar tendencia:', error);
    return 0.5;
  }
};

// Calcular puntuación de calidad de señal
export const calculateSignalQuality = (signalData) => {
  try {
    if (!signalData || signalData.length < 10) {
      return 0;
    }
    
    // Calcular variabilidad de la señal
    const mean = signalData.reduce((a, b) => a + b, 0) / signalData.length;
    const variance = signalData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / signalData.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalizar calidad (0-1)
    // Mayor variabilidad = mejor calidad de señal
    const quality = Math.min(1, stdDev / 50);
    
    return quality;
  } catch (error) {
    console.error('Error al calcular calidad de señal:', error);
    return 0;
  }
};

// Obtener recomendaciones de medición basadas en la calidad
export const getMeasurementRecommendations = (quality, stressLevel) => {
  const recommendations = [];
  
  if (quality < 0.3) {
    recommendations.push('Coloca tu dedo firmemente sobre la cámara y el flash');
    recommendations.push('Asegúrate de que el dedo cubra completamente la lente');
    recommendations.push('Mantén la mano estable durante la medición');
    recommendations.push('Evita movimientos bruscos o temblores');
  } else if (quality < 0.7) {
    recommendations.push('La señal es aceptable pero podría mejorarse');
    recommendations.push('Intenta mantener una presión constante');
    recommendations.push('Evita cambios de iluminación durante la medición');
  } else {
    recommendations.push('Excelente calidad de señal');
    recommendations.push('Continúa con esta técnica para futuras mediciones');
  }
  
  // Agregar recomendaciones específicas según el nivel de estrés
  if (stressLevel === 'alto') {
    recommendations.push('Considera medir en un momento más tranquilo del día');
    recommendations.push('Practica respiración profunda antes de la medición');
  }
  
  return recommendations;
};

// Calcular puntuación de confiabilidad de la medición
export const calculateMeasurementReliability = (heartRate, quality, variability) => {
  try {
    // Factores que afectan la confiabilidad
    const qualityWeight = 0.4;
    const variabilityWeight = 0.3;
    const heartRateWeight = 0.3;
    
    // Puntuación de calidad (ya normalizada 0-1)
    const qualityScore = quality;
    
    // Puntuación de variabilidad (normalizada)
    const variabilityScore = Math.min(1, variability / 0.5);
    
    // Puntuación de frecuencia cardíaca (rango normal = alta confiabilidad)
    const heartRateScore = heartRate >= 60 && heartRate <= 100 ? 1.0 : 0.7;
    
    // Calcular puntuación total ponderada
    const reliability = (
      qualityScore * qualityWeight +
      variabilityScore * variabilityWeight +
      heartRateScore * heartRateWeight
    );
    
    return Math.min(1, Math.max(0, reliability));
  } catch (error) {
    console.error('Error al calcular confiabilidad:', error);
    return 0.5;
  }
};

// Obtener interpretación del nivel de estrés
export const getStressInterpretation = (stressLevel, heartRate, age = 30) => {
  const interpretation = {
    bajo: {
      description: 'Tu nivel de estrés está en un rango saludable',
      meaning: 'Indica que tu sistema nervioso está funcionando de manera óptima',
      recommendation: 'Mantén tus hábitos actuales y rutinas de bienestar',
    },
    medio: {
      description: 'Tu nivel de estrés está moderadamente elevado',
      meaning: 'Puede indicar que estás experimentando algunos desafíos en tu vida',
      recommendation: 'Considera implementar técnicas de relajación regulares',
    },
    alto: {
      description: 'Tu nivel de estrés está significativamente elevado',
      meaning: 'Indica que tu cuerpo está experimentando una respuesta de estrés crónico',
      recommendation: 'Prioriza el autocuidado y considera buscar apoyo profesional',
    },
  };
  
  const level = stressLevel.toLowerCase();
  const baseInterpretation = interpretation[level] || interpretation.medio;
  
  // Personalizar según la frecuencia cardíaca
  let heartRateContext = '';
  if (heartRate > 100) {
    heartRateContext = ' Tu frecuencia cardíaca elevada sugiere que tu cuerpo está trabajando más de lo normal.';
  } else if (heartRate < 60) {
    heartRateContext = ' Tu frecuencia cardíaca baja puede indicar un buen nivel de condición física o relajación.';
  }
  
  return {
    ...baseInterpretation,
    heartRateContext,
    fullDescription: baseInterpretation.description + heartRateContext,
  };
};

