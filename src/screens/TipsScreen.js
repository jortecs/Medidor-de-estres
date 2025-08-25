import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TipsScreen = () => {
  const [expandedTip, setExpandedTip] = useState(null);

  const tips = [
    {
      id: 1,
      title: 'Respiración Profunda',
      icon: 'air',
      category: 'Respiración',
      shortDescription: 'Técnica de respiración 4-7-8 para reducir el estrés',
      fullDescription: 'La técnica de respiración 4-7-8 es una práctica simple pero efectiva para reducir el estrés. Inhala por la nariz durante 4 segundos, mantén la respiración durante 7 segundos, y exhala por la boca durante 8 segundos. Repite este ciclo 4 veces.',
      benefits: ['Reduce la frecuencia cardíaca', 'Mejora la concentración', 'Induce la relajación'],
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'Meditación Mindfulness',
      icon: 'self-improvement',
      category: 'Meditación',
      shortDescription: 'Practica la atención plena para calmar la mente',
      fullDescription: 'La meditación mindfulness te ayuda a enfocarte en el momento presente sin juzgar. Siéntate en una posición cómoda, cierra los ojos y concéntrate en tu respiración. Cuando tu mente divague, regresa suavemente a la respiración.',
      benefits: ['Reduce la ansiedad', 'Mejora el bienestar emocional', 'Aumenta la claridad mental'],
      color: '#2196F3',
    },
    {
      id: 3,
      title: 'Ejercicio Regular',
      icon: 'fitness-center',
      category: 'Actividad Física',
      shortDescription: 'El ejercicio libera endorfinas que combaten el estrés',
      fullDescription: 'El ejercicio físico regular es una de las mejores formas de combatir el estrés. Las endorfinas liberadas durante el ejercicio actúan como analgésicos naturales y mejoran el estado de ánimo. Intenta hacer al menos 30 minutos de ejercicio moderado al día.',
      benefits: ['Libera endorfinas', 'Mejora el sueño', 'Aumenta la energía'],
      color: '#FF9800',
    },
    {
      id: 4,
      title: 'Hidratación Adecuada',
      icon: 'local-drink',
      category: 'Salud',
      shortDescription: 'Mantén tu cuerpo hidratado para reducir el estrés',
      fullDescription: 'La deshidratación puede aumentar los niveles de cortisol, la hormona del estrés. Asegúrate de beber al menos 8 vasos de agua al día. El agua ayuda a mantener el equilibrio hormonal y mejora la función cerebral.',
      benefits: ['Regula las hormonas', 'Mejora la función cerebral', 'Reduce la fatiga'],
      color: '#00BCD4',
    },
    {
      id: 5,
      title: 'Técnica de Relajación Muscular',
      icon: 'accessibility',
      category: 'Relajación',
      shortDescription: 'Relaja progresivamente todos los músculos del cuerpo',
      fullDescription: 'La relajación muscular progresiva consiste en tensar y luego relajar diferentes grupos musculares. Comienza por los pies y sube gradualmente hasta la cabeza. Esta técnica ayuda a identificar y liberar la tensión muscular.',
      benefits: ['Reduce la tensión muscular', 'Mejora el sueño', 'Alivia el dolor'],
      color: '#9C27B0',
    },
    {
      id: 6,
      title: 'Gestión del Tiempo',
      icon: 'schedule',
      category: 'Organización',
      shortDescription: 'Organiza tu tiempo para reducir la presión',
      fullDescription: 'Una buena gestión del tiempo puede reducir significativamente el estrés. Prioriza tus tareas, establece límites realistas y aprende a decir "no" cuando sea necesario. Usa técnicas como la matriz de Eisenhower para organizar tus actividades.',
      benefits: ['Reduce la presión', 'Aumenta la productividad', 'Mejora la satisfacción'],
      color: '#607D8B',
    },
    {
      id: 7,
      title: 'Conexión Social',
      icon: 'people',
      category: 'Social',
      shortDescription: 'Mantén conexiones sociales para el bienestar emocional',
      fullDescription: 'Las conexiones sociales son fundamentales para la salud mental. Dedica tiempo a familiares y amigos, únete a grupos con intereses similares, o considera el voluntariado. El apoyo social actúa como un amortiguador contra el estrés.',
      benefits: ['Proporciona apoyo emocional', 'Reduce la soledad', 'Mejora la perspectiva'],
      color: '#E91E63',
    },
    {
      id: 8,
      title: 'Alimentación Equilibrada',
      icon: 'restaurant',
      category: 'Nutrición',
      shortDescription: 'Una dieta saludable apoya la gestión del estrés',
      fullDescription: 'La nutrición juega un papel importante en la gestión del estrés. Consume alimentos ricos en omega-3, vitaminas B, magnesio y antioxidantes. Evita el exceso de cafeína, azúcar y alimentos procesados que pueden exacerbar el estrés.',
      benefits: ['Estabiliza el estado de ánimo', 'Mejora la energía', 'Fortalece el sistema inmune'],
      color: '#8BC34A',
    },
  ];

  const toggleTip = (tipId) => {
    setExpandedTip(expandedTip === tipId ? null : tipId);
  };

  const renderTipCard = (tip) => {
    const isExpanded = expandedTip === tip.id;
    
    return (
      <View key={tip.id} style={styles.tipCard}>
        <TouchableOpacity
          style={styles.tipHeader}
          onPress={() => toggleTip(tip.id)}
          activeOpacity={0.7}
        >
          <View style={styles.tipIconContainer}>
            <Icon name={tip.icon} size={30} color={tip.color} />
          </View>
          
          <View style={styles.tipInfo}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipCategory}>{tip.category}</Text>
            <Text style={styles.tipShortDescription}>
              {tip.shortDescription}
            </Text>
          </View>
          
          <Icon
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.tipContent}>
            <Text style={styles.tipFullDescription}>
              {tip.fullDescription}
            </Text>
            
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Beneficios:</Text>
              {tip.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Icon name="check-circle" size={16} color={tip.color} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCategoryFilter = () => {
    const categories = [...new Set(tips.map(tip => tip.category))];
    
    return (
      <View style={styles.categoryFilter}>
        <Text style={styles.filterTitle}>Filtrar por categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.categoryButton, styles.categoryButtonActive]}>
            <Text style={styles.categoryButtonText}>Todas</Text>
          </TouchableOpacity>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Consejos para Reducir el Estrés</Text>
          <Text style={styles.subtitle}>
            Descubre técnicas efectivas para manejar el estrés y mejorar tu bienestar
          </Text>
        </View>

        {renderCategoryFilter()}

        <View style={styles.tipsContainer}>
          {tips.map(renderTipCard)}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="info" size={30} color="#4CAF50" />
            <Text style={styles.infoTitle}>¿Por qué es importante gestionar el estrés?</Text>
            <Text style={styles.infoText}>
              El estrés crónico puede afectar negativamente tu salud física y mental. 
              Aprender a gestionarlo efectivamente puede mejorar tu calidad de vida, 
              relaciones y rendimiento en el trabajo.
            </Text>
          </View>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryFilter: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  tipIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tipCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  tipShortDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipContent: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tipFullDescription: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  benefitsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default TipsScreen;

