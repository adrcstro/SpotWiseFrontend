// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      setIsFirstLaunch(hasSeenOnboarding === null);
    };
    checkOnboarding();
  }, []);

  // Render nothing until `isFirstLaunch` has been determined
  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        // Show Onboarding screen on first launch
        <Stack.Screen name="Onboarding" />
      ) : (
        // Show main app tabs if onboarding has already been seen
        <Stack.Screen name="(tabs)/_layout" />
      )}
    </Stack>
  );
}
