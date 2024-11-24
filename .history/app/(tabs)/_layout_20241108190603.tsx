// app/_layout.tsx
import { Tabs, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
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

  // Use a Stack Navigator to allow for transitioning between Onboarding and the main app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        // Show Onboarding screen on first launch
        <Stack.Screen name="Onboarding" />
      ) : (
        // Show main app tabs if onboarding has already been seen
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
