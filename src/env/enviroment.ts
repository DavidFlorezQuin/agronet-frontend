// src/environments/environment.ts

export const environment = {
    production: false,  // Indica que este es un entorno de desarrollo
    apiBaseUrl: 'http://10.192.88.56:9191/api',  // URL base de la API para el entorno de desarrollo
    logging: true,  // Habilita la salida de logs para depuración
    featureFlags: {
      enableNewFeatureX: true,  // Habilita o deshabilita nuevas funcionalidades
      useMockData: false  // Indica si se deben usar datos simulados en lugar de reales
    },
    timeoutSettings: {
      apiRequestTimeout: 30000  // Timeout para las solicitudes API en milisegundos
    }
  };
