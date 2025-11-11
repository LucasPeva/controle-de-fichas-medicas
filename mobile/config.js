// Configuration utility for the mobile app
const CONFIG_KEY = 'app_config';

const defaultConfig = {
  apiBaseUrl: 'http://192.168.18.13:5000',
};

// Pega o que tá salvo no global ou o default caso não tenha nada salvo
export const getConfig = async () => {
  try {
    if (global.appConfig) {
      return global.appConfig;
    }
    
    // Tenta pegar do globalStorage
    if (global.storage && global.storage.getItem) {
      const storedConfig = global.storage.getItem(CONFIG_KEY);
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        global.appConfig = { ...defaultConfig, ...config };
        return global.appConfig;
      }
    }
    
    // Retorna default caso não encontre nada
    global.appConfig = { ...defaultConfig };
    return global.appConfig;
  } catch (error) {
    console.error('Error loading config:', error);
    global.appConfig = { ...defaultConfig };
    return global.appConfig;
  }
};

// Update configuracao
export const updateConfig = async (newConfig) => {
  try {
    const currentConfig = await getConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    
    // Salva no global storage
    global.appConfig = updatedConfig;
    
    // persistencia
    if (global.storage && global.storage.setItem) {
      global.storage.setItem(CONFIG_KEY, JSON.stringify(updatedConfig));
    }
    
    return updatedConfig;
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
};

// GET genérico pra cada endpoint
export const getApiUrl = async (endpoint = '') => {
  const config = await getConfig();
  return `${config.apiBaseUrl}${endpoint}`;
};

// Inicializa a config dos IP
export const initializeConfig = async () => {
  await getConfig();
  return global.appConfig;
};