// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router/tabs';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Set to false once you've completed the welcome screen, e.g., using AsyncStorage
    setShowWelcome(false);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {showWelcome ? (
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
