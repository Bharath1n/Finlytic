// authgear.js
// Created on: September 07, 2025, 04:33 PM IST
// Purpose: Centralize Authgear client initialization for consistent authentication across the app
// Note: Ensure the clientID and endpoint are set according to your Authgear dashboard

import { WebContainer } from '@authgear/web';

const authgearClient = new WebContainer();

// Configure the client with default options (to be overridden in App.jsx if needed)
authgearClient.configure({
  clientID: 'ca6581552d3e3e3a', // Replace with your actual clientID if not using dynamic config
  endpoint: 'https://finylytic.authgear.cloud', // Authgear endpoint for your app
}).catch((error) => {
  console.error('Authgear initial configuration failed:', error);
  // In a real app, you might want to notify the user or retry configuration
});

export { authgearClient };