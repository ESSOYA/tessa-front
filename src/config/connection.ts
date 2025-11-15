// Configuration de connexion Backend-Frontend
// TESSA COIFFURE

export const CONNECTION_CONFIG = {
  // URLs de base
  BACKEND_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  FRONTEND_URL: window.location.origin,
  
  // Configuration de l'application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'TESSA COIFFURE',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 secondes
  CONNECTION_TIMEOUT: 5000, // 5 secondes
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 seconde
  
  // Endpoints de test
  HEALTH_CHECK: '/health',
  API_INFO: '/api',
  API_DOCS: '/api/docs'
};

// Fonction pour tester la connexion au backend
export const testBackendConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONNECTION_CONFIG.CONNECTION_TIMEOUT);
    
    const response = await fetch(`${CONNECTION_CONFIG.BACKEND_URL.replace('/api', '')}${CONNECTION_CONFIG.HEALTH_CHECK}`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'Connexion au backend réussie',
        details: data
      };
    } else {
      return {
        success: false,
        message: `Erreur HTTP: ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Timeout: Le backend ne répond pas dans les temps'
        };
      }
      return {
        success: false,
        message: `Erreur de connexion: ${error.message}`
      };
    }
    return {
      success: false,
      message: 'Erreur inconnue lors de la connexion'
    };
  }
};

// Fonction pour obtenir les informations de l'API
export const getApiInfo = async (): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const response = await fetch(`${CONNECTION_CONFIG.BACKEND_URL.replace('/api', '')}${CONNECTION_CONFIG.API_INFO}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data
      };
    } else {
      return {
        success: false,
        error: `Erreur HTTP: ${response.status}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour vérifier la configuration
export const checkConfiguration = (): {
  isValid: boolean;
  issues: string[];
  config: any;
} => {
  const issues: string[] = [];
  const config = {
    backendUrl: CONNECTION_CONFIG.BACKEND_URL,
    frontendUrl: CONNECTION_CONFIG.FRONTEND_URL,
    appName: CONNECTION_CONFIG.APP_NAME,
    appVersion: CONNECTION_CONFIG.APP_VERSION,
    environment: import.meta.env.MODE,
    nodeEnv: import.meta.env.NODE_ENV
  };
  
  // Vérifications
  if (!CONNECTION_CONFIG.BACKEND_URL) {
    issues.push('URL du backend non configurée');
  }
  
  if (!CONNECTION_CONFIG.BACKEND_URL.includes('localhost') && !CONNECTION_CONFIG.BACKEND_URL.includes('127.0.0.1')) {
    issues.push('URL du backend ne semble pas être en local');
  }
  
  if (CONNECTION_CONFIG.BACKEND_URL.includes('localhost:3000')) {
    // Configuration par défaut détectée
    console.log('🔧 Configuration par défaut détectée pour TESSA COIFFURE');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config
  };
};

// Export des constantes pour utilisation dans l'application
export const {
  BACKEND_URL,
  FRONTEND_URL,
  APP_NAME,
  APP_VERSION,
  REQUEST_TIMEOUT,
  CONNECTION_TIMEOUT,
  MAX_RETRIES,
  RETRY_DELAY
} = CONNECTION_CONFIG;

