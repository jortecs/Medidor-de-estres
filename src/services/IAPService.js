// Versión web del IAPService - Simulación de compras in-app

// Productos disponibles
const PRODUCTS = {
  SUBSCRIPTIONS: [
    {
      id: 'premium_monthly',
      title: 'Premium Mensual',
      description: 'Acceso completo por 30 días',
      price: '$4.99',
      period: 'month',
      popular: false,
    },
    {
      id: 'premium_yearly',
      title: 'Premium Anual',
      description: 'Acceso completo por 12 meses (Ahorra 40%)',
      price: '$29.99',
      period: 'year',
      popular: true,
    },
    {
      id: 'premium_lifetime',
      title: 'Premium de por Vida',
      description: 'Acceso completo para siempre',
      price: '$99.99',
      period: 'lifetime',
      popular: false,
    },
  ],
};

// Estado de suscripción (simulado)
let subscriptionStatus = {
  isPremium: false,
  type: null,
  expiryDate: null,
};

// Inicializar IAP
export const initIAP = async () => {
  try {
    console.log('Inicializando IAP para web...');
    
    // Simular delay de inicialización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Cargar estado de suscripción desde localStorage
    const storedStatus = localStorage.getItem('detector_estres_subscription');
    if (storedStatus) {
      subscriptionStatus = JSON.parse(storedStatus);
    }
    
    console.log('IAP inicializado para web');
    return { success: true };
  } catch (error) {
    console.error('Error al inicializar IAP en web:', error);
    return { success: false, error: error.message };
  }
};

// Obtener estado de suscripción
export const getSubscriptionStatus = async () => {
  try {
    return subscriptionStatus;
  } catch (error) {
    console.error('Error al obtener estado de suscripción en web:', error);
    return { isPremium: false, type: null, expiryDate: null };
  }
};

// Obtener productos disponibles
export const getAvailableProducts = async () => {
  try {
    return PRODUCTS.SUBSCRIPTIONS;
  } catch (error) {
    console.error('Error al obtener productos en web:', error);
    return [];
  }
};

// Comprar producto
export const purchaseProduct = async (productId) => {
  try {
    console.log('Simulando compra de producto:', productId);
    
    // Simular proceso de compra
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular éxito de compra
    const product = PRODUCTS.SUBSCRIPTIONS.find(p => p.id === productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    // Actualizar estado de suscripción
    subscriptionStatus.isPremium = true;
    subscriptionStatus.type = product.period;
    
    if (product.period === 'lifetime') {
      subscriptionStatus.expiryDate = null;
    } else {
      const expiryDate = new Date();
      if (product.period === 'month') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (product.period === 'year') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }
      subscriptionStatus.expiryDate = expiryDate.toISOString();
    }
    
    // Guardar en localStorage
    localStorage.setItem('detector_estres_subscription', JSON.stringify(subscriptionStatus));
    
    console.log('Compra simulada exitosa:', subscriptionStatus);
    return { success: true, subscription: subscriptionStatus };
  } catch (error) {
    console.error('Error al comprar producto en web:', error);
    return { success: false, error: error.message };
  }
};

// Restaurar compras
export const restorePurchases = async () => {
  try {
    console.log('Simulando restauración de compras...');
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar si hay suscripción guardada
    const storedStatus = localStorage.getItem('detector_estres_subscription');
    if (storedStatus) {
      const status = JSON.parse(storedStatus);
      
      // Verificar si la suscripción no ha expirado
      if (status.expiryDate) {
        const expiryDate = new Date(status.expiryDate);
        if (expiryDate > new Date()) {
          subscriptionStatus = status;
          console.log('Compras restauradas:', subscriptionStatus);
          return { success: true, subscription: subscriptionStatus };
        } else {
          // Suscripción expirada
          localStorage.removeItem('detector_estres_subscription');
          subscriptionStatus = { isPremium: false, type: null, expiryDate: null };
        }
      } else if (status.type === 'lifetime') {
        // Suscripción de por vida
        subscriptionStatus = status;
        console.log('Compras restauradas (lifetime):', subscriptionStatus);
        return { success: true, subscription: subscriptionStatus };
      }
    }
    
    console.log('No se encontraron compras para restaurar');
    return { success: false, error: 'No se encontraron compras' };
  } catch (error) {
    console.error('Error al restaurar compras en web:', error);
    return { success: false, error: error.message };
  }
};

// Verificar límite diario
export const checkDailyLimit = async () => {
  try {
    if (subscriptionStatus.isPremium) {
      return 999; // Usuarios premium tienen límite muy alto
    }
    
    // Para usuarios gratuitos, verificar límite diario
    const today = new Date().toDateString();
    const dailyCount = localStorage.getItem(`daily_count_${today}`) || 0;
    
    return parseInt(dailyCount);
  } catch (error) {
    console.error('Error al verificar límite diario en web:', error);
    return 0;
  }
};

// Incrementar contador diario
export const incrementDailyCount = async () => {
  try {
    if (subscriptionStatus.isPremium) {
      return; // Usuarios premium no tienen límite
    }
    
    const today = new Date().toDateString();
    const currentCount = parseInt(localStorage.getItem(`daily_count_${today}`) || 0);
    localStorage.setItem(`daily_count_${today}`, currentCount + 1);
  } catch (error) {
    console.error('Error al incrementar contador diario en web:', error);
  }
};

// Verificar si la suscripción ha expirado
export const checkSubscriptionExpiry = async () => {
  try {
    if (!subscriptionStatus.isPremium || !subscriptionStatus.expiryDate) {
      return false;
    }
    
    const expiryDate = new Date(subscriptionStatus.expiryDate);
    const isExpired = expiryDate <= new Date();
    
    if (isExpired) {
      // Suscripción expirada, actualizar estado
      subscriptionStatus = { isPremium: false, type: null, expiryDate: null };
      localStorage.setItem('detector_estres_subscription', JSON.stringify(subscriptionStatus));
      console.log('Suscripción expirada');
    }
    
    return isExpired;
  } catch (error) {
    console.error('Error al verificar expiración de suscripción en web:', error);
    return false;
  }
};

// Cancelar suscripción
export const cancelSubscription = async () => {
  try {
    console.log('Simulando cancelación de suscripción...');
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Actualizar estado
    subscriptionStatus = { isPremium: false, type: null, expiryDate: null };
    localStorage.setItem('detector_estres_subscription', JSON.stringify(subscriptionStatus));
    
    console.log('Suscripción cancelada');
    return { success: true };
  } catch (error) {
    console.error('Error al cancelar suscripción en web:', error);
    return { success: false, error: error.message };
  }
};

// Obtener información de facturación
export const getBillingInfo = async () => {
  try {
    if (!subscriptionStatus.isPremium) {
      return null;
    }
    
    return {
      type: subscriptionStatus.type,
      expiryDate: subscriptionStatus.expiryDate,
      isActive: subscriptionStatus.isPremium,
    };
  } catch (error) {
    console.error('Error al obtener información de facturación en web:', error);
    return null;
  }
};

