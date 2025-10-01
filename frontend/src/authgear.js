import { WebContainer } from '@authgear/web';

const authgearClient = new WebContainer();

// Get configuration from environment variables
const getAuthgearConfig = () => {
  const useProxy = import.meta.env.VITE_USE_AUTHGEAR_PROXY === 'true';
  const endpoint = useProxy 
    ? `${window.location.origin}/authgear-proxy` 
    : import.meta.env.VITE_AUTHGEAR_ENDPOINT || 'https://finylytic.authgear.cloud';
  
  return {
    clientID: import.meta.env.VITE_AUTHGEAR_CLIENT_ID || 'ca6581552d3e3e3a',
    endpoint: endpoint,
  };
};

// Configure the client with environment-based options
const initializeAuthgear = async () => {
  try {
    const config = getAuthgearConfig();
    console.log('Configuring Authgear with:', config);
    await authgearClient.configure(config);
  } catch (error) {
    console.error('Authgear initial configuration failed:', error);
  }
};

export { authgearClient, initializeAuthgear, getAuthgearConfig };