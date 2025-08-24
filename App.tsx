import React from 'react';
// Import Text and View to use in our error fallback
import { Text, View } from 'react-native'; 
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import * as Sentry from '@sentry/react-native';

// Initialize Sentry
Sentry.init({
  // Make sure this is your correct DSN from sentry.io
  dsn: 'https://13cff70f2b4c9394617640c5c87e2dd3@o4509900084609024.ingest.sentry.io/4509900115378176',
  tracesSampleRate: 1.0, 
});

// A simple component to show if the app crashes
const ErrorFallback = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
            Oops! Something went wrong.
        </Text>
        <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginTop: 10 }}>
            We've been notified and are working to fix the issue. Please restart the app.
        </Text>
    </View>
);

const App = () => {
  // We have removed the splash screen code for now.

  return (
    // Use the ErrorFallback component
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </Sentry.ErrorBoundary>
  );
};

// Wrap your root component with Sentry
export default Sentry.wrap(App);