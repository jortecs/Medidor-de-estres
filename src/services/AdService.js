// Versión web del AdService - Simulación de anuncios

// Configuración de anuncios (simulada para web)
const AD_CONFIG = {
  production: {
    banner: 'ca-app-pub-3940256099942544/6300978111', // ID de prueba
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // ID de prueba
    rewarded: 'ca-app-pub-3940256099942544/5224354917', // ID de prueba
  },
  development: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
};

let isInitialized = false;

// Inicializar anuncios
export const initAds = async () => {
  try {
    // En web, simulamos la inicialización
    console.log('Inicializando anuncios para web...');
    
    // Simular delay de inicialización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    isInitialized = true;
    console.log('Anuncios inicializados para web');
    return { success: true };
  } catch (error) {
    console.error('Error al inicializar anuncios en web:', error);
    return { success: false, error: error.message };
  }
};

// Mostrar anuncio banner
export const showBannerAd = async () => {
  try {
    if (!isInitialized) {
      console.log('Anuncios no inicializados');
      return { success: false, error: 'Anuncios no inicializados' };
    }

    // Simular mostrar banner
    console.log('Mostrando banner ad en web');
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Error al mostrar banner ad en web:', error);
    return { success: false, error: error.message };
  }
};

// Mostrar anuncio intersticial
export const showInterstitialAd = async () => {
  try {
    if (!isInitialized) {
      console.log('Anuncios no inicializados');
      return { success: false, error: 'Anuncios no inicializados' };
    }

    // Simular mostrar intersticial
    console.log('Mostrando intersticial ad en web');
    
    // Simular delay de carga
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular cierre del anuncio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Error al mostrar intersticial ad en web:', error);
    return { success: false, error: error.message };
  }
};

// Mostrar anuncio recompensado
export const showRewardedAd = async () => {
  try {
    if (!isInitialized) {
      console.log('Anuncios no inicializados');
      return { success: false, error: 'Anuncios no inicializados' };
    }

    // Simular mostrar anuncio recompensado
    console.log('Mostrando rewarded ad en web');
    
    // Simular delay de carga
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular verificación de recompensa
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
      success: true, 
      reward: {
        type: 'measurement_boost',
        amount: 1,
      }
    };
  } catch (error) {
    console.error('Error al mostrar rewarded ad en web:', error);
    return { success: false, error: error.message };
  }
};

// Mostrar anuncio (función general)
export const showAd = async (type = 'interstitial') => {
  try {
    switch (type) {
      case 'banner':
        return await showBannerAd();
      case 'interstitial':
        return await showInterstitialAd();
      case 'rewarded':
        return await showRewardedAd();
      default:
        return await showInterstitialAd();
    }
  } catch (error) {
    console.error('Error al mostrar anuncio en web:', error);
    return { success: false, error: error.message };
  }
};

// Verificar si los anuncios están listos
export const areAdsReady = () => {
  return isInitialized;
};

// Obtener configuración de anuncios
export const getAdConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? AD_CONFIG.production : AD_CONFIG.development;
};

